import {
  Button,
  Card,
  Select,
  TextInput,
  toaster
} from 'evergreen-ui';
import { Formik } from 'formik';
import { createExamRoomDocument } from 'firebase-service/createExamRoomDocument';

import styles from '../../public/css/createExamRoomForm.module.css';

function CreateExamRoomForm({
  userAddress,
}: {
  userAddress: string;
}) {
  return (
    <div className={styles.createExamRoomFormContainer}>
      <Formik
        onSubmit={async (values, actions) => {
          await createExamRoomDocument(userAddress, {
            id: Date.now(),
            subject: values.subject,
            roomName: values.name
          });
          toaster.success('Room created!');
          actions.resetForm();
        }}
        initialValues={{
          subject: '',
          name: ''
        }}>
        {({ values, handleChange, handleSubmit }) => {
          return (
            <Card
              className='card-creating-exam-room-wrapper'
              elevation={1}
            >
              <Select
                className='select-subject'
                name='subject'
                value={values.subject}
                onChange={handleChange}
                placeholder="Subject"
              >
                <option value="" disabled>Subject</option>
                <option value="math">Math</option>
                <option value="literature">Literature</option>
                <option value="english">English</option>
              </Select>
              <div className='input-wrapper'>
                <TextInput
                  name='name'
                  onChange={handleChange}
                  value={values.name}
                  width='100%'
                  placeholder='Exam room name' />
              </div>
              <div className='actions-wrapper'>
                <Button appearance='primary' onClick={() => handleSubmit()}>
                  Create exam room
                </Button>
              </div>
            </Card>
          )
        }}
      </Formik>
    </div>
  );
}

export default CreateExamRoomForm;