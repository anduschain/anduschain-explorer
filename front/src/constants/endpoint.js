import {bindActionCreators} from "redux";
import {mainnet, testnet, devnet} from "../modules/appState";
import {connect} from "react-redux";

const URL = () => `/api/anduschain`;
const WS_URL = () => `ws://${process.env.REACT_APP_WSHOST}/api/ws/anduschain`;
const IP_ADDR = (ip) => `https://ipapi.co/${ip}/json/`;

//Response
/**
 {
    "ip": "8.8.8.8",
    "city": "Mountain View",
    "region": "California",
    "region_code": "CA",
    "country": "US",
    "country_name": "United States",
    "continent_code": "NA",
    "in_eu": false,
    "postal": "94035",
    "latitude": 37.386,
    "longitude": -122.0838,
    "timezone": "America/Los_Angeles",
    "utc_offset": "-0700",
    "country_calling_code": "+1",
    "currency": "USD",
    "languages": "en-US,es-US,haw,fr",
    "asn": "AS15169",
    "org": "Google LLC"
}
 * */

const API = () => {
    return {
        recently : `${URL()}/recently`, // 최근 블록 및 tx 리턴 10개씩
        miners : `${URL()}/miners`, // 채굴 신청자 위치

        recentblocks : `${URL()}/recentblocks`, // 그래프용 최근 블록

        blocks : `${URL()}/blocks`, // { tx갯수, 총 페이지 리턴 }, path > /:page 로 호출하면, 25개씩 리스트가 넘어옴,
        block : `${URL()}/block`, // path > /:number 로 호출하면, 블록 세부 내역 넘어옴

        transactions : `${URL()}/transactions`, // path > /:page 로 호출하면, 25개씩 리스트가 넘어옴
        transaction : `${URL()}/transaction`, // path > /:hash 로 호출하면, tx 세부 내역 넘어옴

        account : `${URL()}/account`, // path > /:account 로 호출하면, 어카운트 내역 나옴
        accountTransaction :  `${URL()}/transactions/account`, // path > /:account { tx갯수, 페이지 리턴 }, /:account/:page { tx 25개씩 리스트가 넘어옴 }
    }
};

const mapStateToProps = (state) => {
    return {
        network: state.appState.network,
    }
};

const mapDispatchToProps = (dispatch) => ({
    changeMainnet: bindActionCreators(mainnet, dispatch),
    changeTestnet: bindActionCreators(testnet, dispatch),
    changeDevnet: bindActionCreators(devnet, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(API);

export {
    URL, WS_URL, API, IP_ADDR
}
