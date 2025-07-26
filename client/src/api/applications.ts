import api from "./api";

export const fetchApplications = async () => {
    const res = await api.get("/applications");
    return res.data;
};

export const fetchUserApplications = async (userId: number) => {
    const res = await api.get(`/applications/user/${userId}`);
    return res.data;
};

export const createApplication = async (data: any) => {
    const res = await api.post("/applications", data);
    return res.data;
};

export const updateApplication = async (id: number, data: any) => {
    const res = await api.put(`/applications/${id}`, data);
    return res.data;
};

export const deleteApplication = async (id: number) => {
    const res = await api.delete(`/applications/${id}`);
    return res.data;
};
