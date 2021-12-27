import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

function ActivityForm() {
    const {activityStore} = useStore();
    const {loading, loadingInitial, createActivity, updateActivity, loadActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    const history = useHistory();
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) {
            loadActivity(id).then((activity) => {
                if (activity !== undefined) {
                    setActivity(activity);
                }
            });
        }
    }, [id, loadActivity])

    function handleSubmit() {
        if (!activity.id) {
            createActivity(activity).then((newActivity) => {
                if (newActivity && newActivity.id) {
                    history.push(`/activities/${newActivity.id}`) ;
                } else {
                    // TODO: some sort of error saving -- it's possible, notify the user 
                    //   OR remove else (negative-path) if global error handling is eventually implemented
                }
            });
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    function handleCancel() {
        activity.id ? history.push(`/activities/${activity.id}`) : history.push("/activities");
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    if (loadingInitial) return <LoadingComponent content="Loading activity..." />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Input placeholder="Title" value={activity.title} name="title" onChange={handleInputChange} />
                <Form.TextArea placeholder="Description" value={activity.description} name="description" onChange={handleInputChange} />
                <Form.Input placeholder="Category" value={activity.category} name="category" onChange={handleInputChange} />
                <Form.Input type="date" placeholder="Date" value={activity.date} name="date" onChange={handleInputChange} />
                <Form.Input placeholder="City" value={activity.city} name="city" onChange={handleInputChange} />
                <Form.Input placeholder="Venue" value={activity.venue} name="venue" onChange={handleInputChange} />
                <Button loading={loading} floated="right" positive type="submit" content="Submit" />
                <Button onClick={() => handleCancel()} floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);