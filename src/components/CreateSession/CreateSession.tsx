import React,{useState} from 'react';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Task,
  } from '../../models/data-models';
import {Modal,Button,Input,Form,InputNumber} from 'antd'
import { createSession } from '../../actions/actions';

const CreateSession= ():JSX.Element =>{

    type AppDispatch = ThunkDispatch<Task, void, AnyAction>;

    const [visible, setVisible] = useState(false)
    const [nameSession,setNameSession] =useState('')

    const history = useHistory();
     const dispatch: AppDispatch = useDispatch();


    const showModal = () => {
        setVisible(true)
     };

    const handleOk = () => {
        const newSession:any ={
            id:nameSession,
            state: 'DRAFT',
            taskId:nameTask,
            startDate:startSession,
            endDate:endSession,
            discardMinScore:false,
            discardMaxScore:false,
            minReiewsAmount:minReviewsAmount,
            desiredReviewersAmount:desireReviewAmount,
            attendees:[
                {
                githubId: "ButterBrot777",
                reviewerOf: [
                    'cardamo'
                ]
            }
        ]
    }

    dispatch(createSession(newSession));
    history.push('/sessions');

    setVisible(false)

      
      
    };   

    const handleCancel = () => {
        setVisible(false)
    };
     

    const [nameTask,setTaskName] =useState('')
    const [startSession,setstartSession] =useState('')
    const [endSession, setEndSession] = useState('')
    const [coefficient,setCoefficient] = useState(0)
    const [minReviewsAmount,setMinReviewsAmount] = useState(0)
    const [desireReviewAmount, setDesireReviewAmount] = useState(0)
    


    return (
    
        <div>
            <Button onClick={showModal} type="primary">Add session</Button>
            <Modal
            title="Create Session"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            >
                <Form.Item  label="Name of session">
                    <Input value={nameSession} onChange={(e) => setNameSession(e.target.value)} />
                </Form.Item>

                <Form.Item label="Name of task">
                    <Input value={nameTask} onChange={(e) => setTaskName(e.target.value)} />
                </Form.Item>

                <Form.Item label="Start date">
                    <Input value={startSession} onChange={(e) => setstartSession(e.target.value)} />
                </Form.Item>

                <Form.Item label="End date ">
                    <Input value={endSession} onChange={(e) => setEndSession(e.target.value)} />
                </Form.Item>

                <Form.Item label="Coefficient">
                    <InputNumber value={coefficient} onChange={(e:any) => setCoefficient(e)} />
                </Form.Item>

                
                <Form.Item label="Min reviews amount">
                    <InputNumber value={minReviewsAmount} onChange={(e:any) => setMinReviewsAmount(e)} />
                </Form.Item>

                <Form.Item label="Desire reviewers Amount">
                    <InputNumber value={desireReviewAmount} onChange={(e:any) => setDesireReviewAmount(e)}/>
                </Form.Item>

          </Modal>
        </div>
          
    )
}

export default CreateSession;