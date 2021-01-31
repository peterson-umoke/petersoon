import { DailyCalendarData } from '@marketplace/core';
import { environment } from '../../../../../../../apps/Marketplace/src/environments/environment';
import { CampaignConversionService } from './campaign-conversion.service';

const prices = environment.DEFAULT_PRICES;
const low = parseFloat(prices.low);
const med = parseFloat(prices.medium);
const high = parseFloat(prices.high);

const maxAudienceDC: Array<DailyCalendarData> = [
  {
    days: [0, 6],
    price_times: [
      [0, 0.0],
      [600, 0.0],
      [600, high],
      [1200, high],
      [1200, med],
      [1320, med],
      [1320, 0.0],
      [1440, 0.0],
    ],
  },
  {
    days: [1, 2, 3, 4, 5],
    price_times: [
      [0, 0.0],
      [360, 0.0],
      [360, low],
      [420, low],
      [420, high],
      [660, high],
      [660, med],
      [900, med],
      [900, high],
      [1200, high],
      [1200, med],
      [1320, med],
      [1320, 0.0],
      [1440, 0.0],
    ],
  },
];

const dailyCommuteDC: Array<DailyCalendarData> = [
  {
    days: [0, 6],
    price_times: [[0, 0.0], [1440, 0.0]],
  },
  {
    days: [1, 2, 3, 4, 5],
    price_times: [
      [0, 0.0],
      [420, 0.0],
      [420, high],
      [600, high],
      [600, 0.0],
      [1020, 0.0],
      [1020, high],
      [1200, high],
      [1200, 0.0],
      [1440, 0.0],
    ],
  },
];

const mealTimesDC: Array<DailyCalendarData> = [
  {
    days: [0, 1, 2, 3, 4, 5, 6],
    price_times: [
      [0, 0.0],
      [420, 0.0],
      [420, high],
      [600, high],
      [600, 0.0],
      [720, 0.0],
      [720, high],
      [840, high],
      [840, 0.0],
      [1020, 0.0],
      [1020, high],
      [1200, high],
      [1200, 0.0],
      [1440, 0.0],
    ],
  },
];

const singleHourDC: Array<DailyCalendarData> = [
  {
    days: [0, 1, 2, 3, 4, 5, 6],
    price_times: [
      [0, 0],
      [1020, 0],
      [1020, high],
      [1080, high],
      [1080, 0],
      [1440, 0.0],
    ],
  },
];

const offPeakHourDC: Array<DailyCalendarData> = [
  {
    days: [0, 6],
    price_times: [[0, med], [1440, med]],
  },
  {
    days: [1, 2, 3, 4, 5],
    price_times: [
      [0, med],
      [420, med],
      [420, 0.0],
      [660, 0.0],
      [660, med],
      [960, med],
      [960, 0.0],
      [1140, 0.0],
      [1140, med],
      [1440, med],
    ],
  },
];

describe('CampaignConversionService', () => {
  let service: CampaignConversionService;

  beforeEach(() => {
    service = new CampaignConversionService(<any>{});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('DailyCalendar and WeeklySchedule conversion', () => {
    it('should convert maxAudience', () => {
      const interpolatedMaxAudience = service.interpolateDailyCalendar(
        maxAudienceDC,
        low,
        med,
        high
      );
      const extrapolatedMaxAudience = service.extrapolateDailyCalendar(
        interpolatedMaxAudience,
        low,
        med,
        high
      );
      expect(extrapolatedMaxAudience).toEqual(maxAudienceDC);
    });
    it('should convert dailyCommute', () => {
      const interpolatedDailyCommute = service.interpolateDailyCalendar(
        dailyCommuteDC,
        low,
        med,
        high
      );
      const extrapolatedDailyCommute = service.extrapolateDailyCalendar(
        interpolatedDailyCommute,
        low,
        med,
        high
      );
      expect(extrapolatedDailyCommute).toEqual(dailyCommuteDC);
    });
    it('should convert mealTimes', () => {
      const interpolatedMealTimes = service.interpolateDailyCalendar(
        mealTimesDC,
        low,
        med,
        high
      );
      const extrapolatedMealTimes = service.extrapolateDailyCalendar(
        interpolatedMealTimes,
        low,
        med,
        high
      );
      expect(extrapolatedMealTimes).toEqual(mealTimesDC);
    });
    it('should convert singleHour', () => {
      const interpolatedSingleHour = service.interpolateDailyCalendar(
        singleHourDC,
        low,
        med,
        high
      );
      const extrapolatedSingleHour = service.extrapolateDailyCalendar(
        interpolatedSingleHour,
        low,
        med,
        high
      );
      expect(extrapolatedSingleHour).toEqual(singleHourDC);
    });
    it('should convert offPeakHour', () => {
      const interpolatedOffPeakHour = service.interpolateDailyCalendar(
        offPeakHourDC,
        low,
        med,
        high
      );
      const extrapolatedOffPeakHour = service.extrapolateDailyCalendar(
        interpolatedOffPeakHour,
        low,
        med,
        high
      );
      expect(extrapolatedOffPeakHour).toEqual(offPeakHourDC);
    });
  });
});
