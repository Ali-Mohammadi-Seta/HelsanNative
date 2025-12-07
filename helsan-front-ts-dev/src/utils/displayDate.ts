import { toPersianDigits } from '@/utils/antdPagination';

const displayDate = (date:string) => {
    if (!date) return '';
    return (
        toPersianDigits(date.substring(0, 4)) +
        '/' +
        toPersianDigits(date.substring(4, 6)) +
        '/' +
        toPersianDigits(date.substring(6, 8))
    );
};
export default displayDate;
