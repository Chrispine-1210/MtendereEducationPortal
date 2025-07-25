import React from "react";
import ApplicationsForm from "../components/applications/ApplicationsForm";
import ApplicationsList from "../components/applications/ApplicationsList";

const Applications = () => {
    return (
        <div>
            <h1>Applications</h1>
            <ApplicationsForm />
            <ApplicationsList />
        </div>
    );
};

export default Applications;
