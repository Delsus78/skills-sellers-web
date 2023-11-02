import moment from 'moment/dist/moment';
import 'moment/dist/locale/fr';
export function getFormattedRemainingTime(endDateStr) {
    moment.locale('fr');

    const now = moment();
    const endDate = moment(endDateStr);
    const remainingTime = moment.duration(endDate.diff(now));
    return remainingTime.locale('fr').humanize(true);
}

export function format(dateStr, formatStr) {
    return moment(dateStr).format(formatStr);
}

export function getClearRemainingTime(dateStr) {
    // format HH:mm:ss
    moment.locale('fr');

    const now = moment();
    const endDate = moment(dateStr);
    const remainingTime = moment.duration(endDate.diff(now));
    return moment.utc(remainingTime.asMilliseconds()).format("HH:mm:ss");
}

export function getPourcentageRemainingTime(dateStr, startStr) {
    moment.locale('fr');

    const now = moment();
    const endDate = moment(dateStr);
    const startDate = moment(startStr);  // suppose que startStr est la date de début
    const total = moment.duration(endDate.diff(startDate));
    const remainingTime = moment.duration(endDate.diff(now));
    const percentage = Math.round(remainingTime.asMilliseconds() / total.asMilliseconds() * 100);

    return 100 - percentage;  // Inverse le pourcentage
}


