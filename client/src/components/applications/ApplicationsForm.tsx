import { useState } from "react";
import { createApplication } from "../../lib/applications";

const ApplicationsForm = () => {
    const [jobId, setJobId] = useState("");
    const [coverLetter, setCoverLetter] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createApplication({
            userId: 1, // replace with actual logged-in user ID from context
            jobId: parseInt(jobId),
            coverLetter,
        });
        setJobId("");
        setCoverLetter("");
        alert("Application submitted");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Apply for a Job</h2>
            <input
                type="number"
                placeholder="Job ID"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                required
            />
            <textarea
                placeholder="Cover Letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
            ></textarea>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ApplicationsForm;
