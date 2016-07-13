import {
    FETCH_GANK_DATA_STATUS
} from './types';

const PAGE_NUM = 10;

function fetchGankCategoryList(typeObj, opt, category, pageNo, ext) {
    return (dispatch) => {
        dispatch({type: typeObj.START, opt: opt});
        let reqUrl = `http://gank.io/api/data/${category}/${PAGE_NUM}/${pageNo}`;;
        return fetch(reqUrl)
            .then((response) => response.json())
            .then(
                (data) => dispatch({type: typeObj.SUCCESS, opt, ext,data: data}),
                (error) => dispatch({type: typeObj.FAILURE, opt, ext, error})
            );
    };
}

export function fetchGankList(opt, category, pageNo, ext) {
    return fetchGankCategoryList(
        FETCH_GANK_DATA_STATUS,
        opt,
        category,
        pageNo, 
        ext
    )
}