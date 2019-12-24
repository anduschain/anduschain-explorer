// base
import React, {Component} from 'react';

// assets
import './search.scss';
import img_search from '../../assets/images/common/icon-search.png';


class Search extends Component {

    state = {
      input : "",
    };

    search = () => {
        if (this.state.input) {
            this.setState({
                input: "",
            });

            if (this.state.input.length === 66 ) {
                window.location.href = `/transaction/${this.state.input}`
            }else if (this.state.input.length === 42) {
                window.location.href = `/account/${this.state.input}`
            }else{
                window.location.href = `/blocks/detail/${this.state.input}`
            }

        }
    };

    inputText = (event) => {
        this.setState({
            input: event.target.value
        });
    };

    endText = (event) => {
        if(event.keyCode === 13) {
            this.search();
        }

    };

    render() {
        return (
            <article className="search">
                <div className="search_wrapper">
                    <span className="search_text">Search</span>
                    <input className="search_input"
                           type="text"
                           placeholder="Block Number, TX Hash, Account"
                           value={this.state.input}
                           onChange={this.inputText} onKeyDown={this.endText} />
                    <img className="search_img" src={ img_search } alt="검색" onClick={this.search}/>
                </div>
            </article>
        )
    }
};

export default Search;