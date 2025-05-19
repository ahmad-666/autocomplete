import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.locale('en');
dayjs.extend(utc); //? if we see wrong time(HH:mm:ss) when we parse date with dayjs that's because dayjs uses local timezone so we need to convert it to utc and then parse it --> dayjs(...).utc().format('HH:mm')

export default dayjs;
