// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import { render, h } from "preact";
import SocialBar from 'shared/js/SocialShare';
import {$, $$} from 'shared/js/util';
import RelatedContent from "shared/js/RelatedContent";
import {gsap, Sine} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Brother from "./Brother";
import store, { ACTION_SET_SECTIONS, fetchData } from "./store";
import {SwitchTransition, Transition, TransitionGroup} from "react-transition-group";
import { Logo, ScrollDown} from "./Icons";
import {Provider, useSelector, useDispatch} from "react-redux";
import { useEffect, useRef, useState } from "preact/hooks";
import {SmoothProvider} from "react-smooth-scrolling";

const assetsPath = "<%= path %>";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({
    duration:1,
    ease: 'sine.inOut'
});

const setHtml = (html) => ({__html: html});

const Container = ({children}) => {
    return (
        <div className="container">
            {children}
        </div>
    )
}
// const FlexContainer = (props) => {
const FlexContainer = ({children, className}) => {
    return (
        <div className={`flex-container ${className}`} >
            {children}
        </div>
    )
}


const Loading = () => 
    <FlexContainer className="loading">
        <div style={{width: 300}}>
            <img src={`${assetsPath}/glab_logo.svg`} />
        </div>
    </FlexContainer>

const Header = () => {
    const content = useSelector(s=>s.content);

    return (
        <header>
            <div className="">

                <div className="bg"
                    style={`background-image: linear-gradient(360deg, rgba(0,0,0,0.7) 10%, transparent 40%), url('${assetsPath}/header.jpg');`}>
                    
                    <div className="client">
                        <p>Paid for by 
                            <a href={content.logoLink} target="_blank">
                                <Logo />
                            </a>
                        </p>
                        <div className="about-content" dangerouslySetInnerHTML={setHtml(content.aboutLink)} />
                    </div>
                        <div className="w-90p m-auto">
                            <div class="title m-text-right">
                                <h1 className="text-bg"><span data-dyn="headline">{content.headline}</span></h1>
                                <div className="subhead" dangerouslySetInnerHTML={setHtml(content.subhead)}></div>
                            </div>
                            <ScrollDown />
                    </div>
                </div>
            </div>
        </header>        
    )
}

const Footer = ({content, related, shareUrl}) => {

    return (
        <section className="footer dark-text">
            <div className="content">
                <div className="cta-wrap">
                    <div className="cta" dangerouslySetInnerHTML={setHtml(content.cta)} />
                    <div className="disc" dangerouslySetInnerHTML={setHtml(content.disc)}></div>

                </div>
                
                <div className="break"><span /><span /><span /><span /></div>
                <div className="share">
                    <SocialBar title={content.shareTitle} url={shareUrl} />
                </div>
                <div className="related">
                    <RelatedContent cards={related} />
                </div>
            </div>
        </section>
    )
}

const Standfirst = ({content}) => {

    return (
        <section className="standfirst">
            <div className="content" >
                <div className="lines">

                <div className="body" dangerouslySetInnerHTML={setHtml(content.standfirst)}>

                </div>
                </div>
                <ScrollDown />
            </div>
        </section>
    )
}
const SmoothScroll = ({children}) => {
    const app = useRef();
    const [pos, setPos] = useState(window.scrollY);
    useEffect(()=>{
        window.addEventListener('scroll', (e) => {
            e.preventDefault();
            const dy = pos-window.scrollY;
            console.log(Math.max(-2100, dy));
            setPos(window.scrollY);
            gsap.to(app.current, {duration: 0.5, y: Math.max(-2100, dy), ease: 'sine.out'});
        });
    },[])
    return (
        <div ref={app}>
            {children}
        </div>
    )
}

const MainBody = ({children}) => {
    const mainRef = useRef();

    // useEffect(()=>{
    //     const resize = () => {
    //         // mainRef.current.style.height = mainRef.current.scrollHeight * 0.5 + 'px';
    //         mainRef.current.style.height = document.body.scrollHeight * 0.5 + 'px';
    //         // console.log(mainRef.current.scrollHeight, mainRef.current.scrollHeight * 0.5 + 'px');
    //         console.log('size')
    //     }
    //     window.addEventListener('resize', resize);

    //     resize();

    //     return () => window.removeEventListener('resize', resize);
    // },[]);

    return (
        <div className="main" ref={mainRef}>
            {children}
        </div>
    )
}

const Main = () => {
    const loaded = useSelector(s=>s.dataLoaded);
    
    const dispatch = useDispatch();



    useEffect(()=>{
        dispatch( fetchData('https://interactive.guim.co.uk/docsdata/12b7ABKuCvTUHl0toueUkTe6TLSTBCr1MP4JrjfBR3ug.json') );
    },[]);


    

    const content = useSelector(s=>s.content);

    const store = useSelector(s=>s);    
    // return <Loading />;

    return (
        <SwitchTransition>
            <Transition
                key={loaded}
                timeout={1000}
                onEnter={n=>gsap.from(n,{alpha: 0})}
                onExit={n=>gsap.to(n,{alpha:0})}
                mountOnEnter
                unmountOnExit
                appear={true}
            >
                {!loaded && <Loading />}
                {loaded &&

                    
                    <MainBody>

                        
                        <Header />
                        <Standfirst content={content} />
                        <Brother />
                        <Footer content={content} related={store.sheets.related} shareUrl={store.sheets.global[0].shareUrl} />
                        
                        
                    </MainBody>
                    
                }
            </Transition>            
        </SwitchTransition>
    )
}


const App = () => {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>

    )
}

render( <App/>, document.getElementById('Glabs'));

