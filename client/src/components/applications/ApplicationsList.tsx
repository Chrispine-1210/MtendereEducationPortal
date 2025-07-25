import { useEffect, useState } from "react";
import { fetchApplications, deleteApplication } from "../../lib/applications";

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await fetchApplications();
            setApplications(data);
        };
        load();
    }, []);

    const handleDelete = async (id: number) => {
        await deleteApplication(id);
        setApplications(applications.filter(a => a.id !== id));
    };

    return (
        <div>
            <h2>Applications</h2>
            <ul>
                {applications.map((app) => (
                    <li key={app.id}>
                        Job ID: {app.jobId}, Status: {app.status}
                        <button onClick={() => handleDelete(app.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ApplicationsList;
