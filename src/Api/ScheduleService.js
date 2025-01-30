// import React from "react";
// import useScheduleCallHistoryStore from "../stores/schedule.store";
import {appAxios} from './apiInterceptors';

export const ScheduleAllDateWise = async data => {
  try {
    const apiRes = await appAxios.post(
      '/officer_schedule/schedule-officer-find',
      data,
    );
    return apiRes?.data?.data;
  } catch (error) {
    return [];
    // throw error;
  }
};

export const getScheduleAll = async count => {
  try {
    const apiRes = await appAxios.get(
      '/officer_schedule/getSchedule-officer-list?page=' + count,
    );
    return apiRes?.data?.data;
  } catch (error) {
    return [];
    // throw error;
  }
};

export const ConsultaionAllDatewise = async data => {
  try {
    const apiRes = await appAxios.post(
      '/consultation/get-consultation-by-date',
      data,
    );
    return apiRes?.data?.data;
  } catch (error) {
    return [];
    // throw error;
  }
};
