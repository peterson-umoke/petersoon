import * as functions from 'firebase-functions';
import { admin } from './shared';

interface Design15 {
  available: boolean;
  description: string;
  webhookToken: string;
}

export const design15 = functions.https.onRequest(async (req: functions.https.Request, resp: functions.Response) => {
  const body = req.body;
  const slackToken = functions.config().slack.token;

  if (body.token !== slackToken) {
    resp.status(401).send('Unauthorized');
  }

  const collection = await admin.firestore().collection(`design`).where(`webhookToken`, '==', slackToken);
  if (body.text.includes('status')) {
    const document = await collection.get();
    const real = await document.docs[0].data() as Design15;
    resp.status(200).send({ text: `Design 15 link is currently ${real.available ? 'ON' : 'OFF'}` });
  }

  if (body.text.includes('on') || body.text.includes('off')) {
    const available = body.text.includes('on') ? true : false;
    const document = await collection.get()
    try {
      const doc = admin.firestore().doc(`design/${document.docs[0].id}`);
      const snapshot = await doc.get()
      const design = snapshot.data() as Design15;

      // Check if they are trying to turn on or off something that is already on or off
      if (design.available && available || !design.available && !available) {
        resp.status(200).send({ text: `Design 15 link is already ${available ? 'showing' : 'hidden'}` });
      } else {
        await doc.update({
          available
        });
        resp.status(200).send({ text: `Design 15 link is now ${available ? 'showing' : 'hidden'}` });
      }
    } catch (error) {
      resp.status(200).send({ text: `Error updating Design link` });
    }
  }
});
