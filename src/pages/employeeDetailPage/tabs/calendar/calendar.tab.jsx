import { Calendar } from 'antd';
import "./calendar.css";

function getListData(value) {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'normal', content: 'This is usual event.' },
      ]; break;
    default:
  }
  return listData || [];
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className="events">
      {
        listData.map(item => (
          <li key={item.content}>
            <span className={`event-${item.type}`}>●</span>
            {item.content}
          </li>
        ))
      }
    </ul>
  );
}

function getMonthData(value) {
  if (value.month() === 8) {
    return 1394;
  }
}

function monthCellRender(value) {
  const num = getMonthData(value);
  return num ? (
    <div className="notes-month">
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

export const CalendarTab = ()=>{
    return (
        <div className='hr-body'>
            <div style={{width:'80%'}}>
                <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
            </div>

            <div style={{width:'20%'}}>

            </div>
        </div>
    );
}

