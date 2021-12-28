import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity } from "../../../app/models/activity";

function ActivityForm() {
    const {activityStore} = useStore();
    const {loading, loadingInitial, createActivity, updateActivity, loadActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    const history = useHistory();
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });
    const validationSchema = Yup.object({
        title: Yup.string().required("The activity title is required"),
        description: Yup.string().required("The activity description is required"),
        category: Yup.string().required(),
        date: Yup.date().required("The activity date is required").nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required()
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

    function handleFormSubmit(activity: Activity) {
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

    if (loadingInitial) return <LoadingComponent content="Loading activity..." />

    return (
        <Segment clearing>
            <Header content="Activity Details"  sub color="teal" />
            <Formik enableReinitialize validationSchema={validationSchema} initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form onSubmit={handleSubmit} autoComplete="off" className="ui form">
                        <MyTextInput placeholder="Title" name="title" />                        
                        <MyTextArea placeholder="Description" name="description" rows={3} />
                        <MySelectInput placeholder="Category" name="category" options={categoryOptions} />
                        <MyDateInput placeholderText="Date" name="date"
                            showTimeSelect
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa" />
                        <Header content="Locationy Details"  sub color="teal" />
                        <MyTextInput placeholder="City" name="city" />
                        <MyTextInput placeholder="Venue" name="venue" />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} floated="right" positive type="submit" content="Submit" />
                        <Button onClick={() => handleCancel()} floated="right" type="button" content="Cancel" />
                    </Form>
                )}  
            </Formik>
        </Segment>
    )
}

export default observer(ActivityForm);