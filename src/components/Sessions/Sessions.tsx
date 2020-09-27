import React,{useEffect, useState} from 'react';
import { Collapse,Button, Pagination,Modal } from 'antd';
import { AnyAction } from 'redux';
import {
  AppReduxState,
  ReviewsState,
  SessionsState
} from '../../models/redux-models';
import { CrossCheckSession } from '../../models/data-models';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {getSession} from '../../actions/actions';
import StateTag from '../StateTag/StateTag';
import CreateSession from '../CreateSession/CreateSession';
import './Session.scss';


const { Panel } = Collapse;

type AppDispatch = ThunkDispatch<ReviewsState, void, AnyAction>;

const Sessions = (): JSX.Element => {

  const sessions = useSelector<AppReduxState, SessionsState>((state) => state.sessions);

  console.log(sessions)
  const dispatch: AppDispatch = useDispatch();

  

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  const [sessionsArr, setSessionsArr] = useState<CrossCheckSession[]>([]);
  const [reviwers, setReviwers] = useState<any[]>([])

  useEffect(() => {
    setSessionsArr(Object.values(sessions));
  }, [sessions]);

  function callback(key:any) {
    console.log('click')
  }
  
  const [visible, setVisible] = useState(false)

  const showModal = (idUser:number,numberSession:number) => {
  let a = sessionsArr[numberSession]
  let b = a.attendees;
  let c = b[idUser]
  let d = c.reviewerOf  
  const g = d.join('\n')
  setReviwers([g])
  setVisible(true)
  };

  const handleOk = () => {
    setVisible(false)
    setReviwers([])
  };

  const handleCancel = () => {
    setVisible(false)
    setReviwers([])
  };

  const panels = sessionsArr.map((session,numberSession) =>{
    console.log(sessions)
    console.log(session)
    const userAndReviewers = session.attendees;
    const users = userAndReviewers.map((user,idUser) =>{
      
      return (
        <div key={idUser} onClick={() => showModal(idUser,numberSession)}>
          {user.githubId} 
        </div>
      )
    })
    
    
    
    return (
      
        <Panel
        header={session.id}
        key={session.id}
        extra={<StateTag state={session.state} />}
        >

          <div>Start date:{session.startDate}</div>
          <div>Deadline:{session.endDate}</div>
          <div>Coefficient:{session.coefficient}</div>
          <div >Students:<a >{users}</a></div>
          <Modal
            title="Reviewers"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            
          >
            {reviwers}
          </Modal >  
          <Pagination className='' defaultCurrent={1} total={1} />
        </Panel>
    )
      
    })
  

  return (
    <div className='sessions'>
      <h2>Cross-Check Sessions</h2>
      <CreateSession />
      <Collapse  onChange={callback}>
        {panels}
        
      </Collapse>
      
    </div>
  );
};

export default Sessions;
