import moment from 'moment/dist/moment';
import 'moment/dist/locale/fr';
export function getFormattedRemainingTime(endDateStr) {
    moment.locale('fr');

    const now = moment();
    const endDate = moment(endDateStr);
    const remainingTime = moment.duration(endDate.diff(now));
    return remainingTime.locale('fr').humanize(true);
}