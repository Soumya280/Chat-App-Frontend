import { Axios } from "../config/AxiosHelper";

export const createRoom = async (roomId) => {
  const res = await Axios.post(`/api/rooms/${roomId}`);

  return res.data;
};

export const joinRoom = async (roomId) => {
  const res = await Axios.get(`/api/rooms/${roomId}`);

  return res.data;
};

export const getMessages = async (roomId, size = 50, page = 0) => {
  const res = await Axios.get(
    `/api/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return res.data;
};
