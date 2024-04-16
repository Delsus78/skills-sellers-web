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

    let formattedTime = "";

    if (remainingTime.days() > 0) {
        const totalHours = remainingTime.asHours();
        const days = Math.floor(totalHours / 24);
        const hours = Math.floor(totalHours % 24);
        const minutes = remainingTime.minutes();
        const seconds = remainingTime.seconds();
        formattedTime = `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (remainingTime.hours() > 0) {
        formattedTime = `${remainingTime.hours().toString().padStart(2, '0')}:${remainingTime.minutes().toString().padStart(2, '0')}:${remainingTime.seconds().toString().padStart(2, '0')}`;
    } else if (remainingTime.minutes() > 0) {
        formattedTime = `${remainingTime.minutes().toString().padStart(2, '0')}:${remainingTime.seconds().toString().padStart(2, '0')}`;
    } else {
        formattedTime = remainingTime.seconds().toString().padStart(2, '0');
    }

    return formattedTime;
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

export function getSecondsBetweenNowAnd(dateStr) {
    const now = moment();
    const endDate = moment(dateStr);
    const remainingTime = moment.duration(endDate.diff(now));
    // format as 00:00 (mm:ss)
    const totalSeconds = Math.floor(remainingTime.asSeconds());
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}