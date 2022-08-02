import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import AppsIcon from "@material-ui/icons/Apps";
import { FaArrowCircleUp } from 'react-icons/fa';
import { Avatar } from "@material-ui/core";
import ReactLoading from "react-loading";
import "./Home.scss";
import {API_KEY, CONTEXT_KEY } from "../keys";

const Home = () => {
    const [query, setQuery] = useState('')
    const [data, setData] = useState([])
    const [start, setStart] = useState(1)
    const [visible, setVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const myRef = useRef(null)

    const callApi = (q, s) => {
        let res = axios({
            "method": "GET",
            "url": "https://www.googleapis.com/customsearch/v1",
            "params": {
                'key': API_KEY,
                'cx': CONTEXT_KEY,
                'q': q,
                'num': 10,
                'start': s
            }
        })
        return res
    }

    const handleSearch = async () => {
        setStart(1);
        let res = await callApi(query, start);

        if (res.data && res.data?.items) {
            let raw = res.data?.items;
            let results = [];
            if (raw && raw.length > 0) {
                raw.map(item => {
                    let object = {};
                    object.id = item.cacheId;
                    object.img = item.pagemap?.cse_image[0]?.src;
                    object.title = item.title;
                    object.link = item.link;
                    object.snippet = item.snippet;
                    results.push(object);
                })
            }
            setData(results)
        }
    }

    const handlePressEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            query && handleSearch();
        }
    }

    const handleScroll = event => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollTop > 300) {
            setVisible(true)
        }
        else if (scrollTop <= 300) {
            setVisible(false)
        }
        if (scrollHeight - scrollTop === clientHeight) {
            start < 100 && setStart(prev => prev + 10)
        }
    }

    useEffect(() => {
        if (start && query) {
            setIsLoading(true);
            setTimeout(() => {
                const getData = async () => {
                    let res = await callApi(query, start)
                    if (res.data && res.data.items) {
                        let raw = res.data.items;
                        let results = [];
                        if (raw && raw.length > 0) {
                            raw.map(item => {
                                let object = {};
                                object.id = item.cacheId;
                                object.img = item.pagemap?.cse_image[0]?.src;
                                object.title = item.title;
                                object.link = item.link;
                                object.snippet = item.snippet;

                                results.push(object);
                            })
                        }
                        setData(prev => [...prev, ...results]);
                        setIsLoading(false);
                    }
                }
                getData()
            }, 1000
            );
            // console.log('start change', start);
        }
    }, [start]);

    const executeScroll = () => myRef.current.scrollIntoView()

    return (
        <>
            <div className="home" onScroll={handleScroll} >
                <div className="home__header" ref={myRef}>
                    <div className="home__header-left">
                        <a href="/">About</a>
                        <a href="/">Store</a>

                    </div>
                    <div className="home__header-right">
                        <a href="/">Gmail</a>
                        <a href="/">Images</a>
                        <AppsIcon />
                        <Avatar />
                    </div>
                </div>
                <div className="container">
                    <div className="home__body">
                        <img
                            src="https://bookingcare.vn/assets/icon/bookingcare-2020.svg"
                            alt=""
                        />
                        <div className="home__body-form" >
                            <div className="form__input">
                                <input type="text"
                                    onChange={(e) => { setQuery(e.target.value) }}
                                    onKeyPress={handlePressEnter}
                                    value={query}
                                />
                            </div>
                        </div>

                        <div className="home__body-result">
                            {data && data.length > 0 &&
                                data.map((item) => {
                                    return (
                                        <div className="result__block" key={item.id} >
                                            <a href={item.link} target="_blank">
                                                <img
                                                    className="result__block-img"
                                                    src={item.img}
                                                    alt=""
                                                />
                                            </a>
                                            <div className="result__block-content">
                                                <a className="content__title" href={item.link} target="_blank" rel="noreferrer">
                                                    <h2>{item.title}</h2>
                                                </a>
                                                <p className="content__snippet">{item.snippet}</p>
                                            </div>

                                        </div>
                                    )
                                })}
                            {isLoading &&
                                <ReactLoading type="spinningBubbles" color="#49BCE2"
                                    height={100} width={50} className="icon-loading" />
                            }
                        </div>
                    </div>
                </div>
                <div className="button__scroll">
                    <FaArrowCircleUp onClick={executeScroll}
                        style={{ display: visible ? 'inline' : 'none' }} />
                </div>
            </div>

        </>

    );
}

export default Home;