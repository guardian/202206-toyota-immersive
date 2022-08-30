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
import AudioPlayer from "../../../../shared/js/AudioPlayer";
import videojs from 'video.js';

const assetsPath = "<%= path %>";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({
    duration:1,
    ease: 'sine.inOut'
});

const setHtml = (html) => ({dangerouslySetInnerHTML:{__html: html}});

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
                    style={`background-image: linear-gradient(360deg, rgba(0,0,0,0.7) 10%, transparent 40%);`}>
                    
                    <LoopingBgVid src="2022_04_Guardian_AdamGoodes_loops_1.mp4" />
                    
                    <div className="client">
                        <p>Paid for by <br />
                            <a href={content.logoLink} target="_blank">
                                <img src={`${assetsPath}/toyota_logo.png`} width="150" />
                            </a>
                        </p>
                        <div className="about-content" {...setHtml(content.aboutLink)} />
                    </div>
                        <div className="w-90p m-auto">
                            <div class="title">
                                <h1 className="text-bg"><span data-dyn="headline" {...setHtml(content.headline)}></span></h1>
                                <div className="subhead" {...setHtml(content.subhead)}></div>
                            </div>
                            
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
                <div className="break"><span /><span /><span /><span /></div>
                <div className="cta-wrap">
                    <div className="cta" {...setHtml(content.cta)} />
                    <div className="disc" {...setHtml(content.disc)}></div>

                </div>
                
                
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

                <div className="body" {...setHtml(content.standfirst)}>

                </div>
                </div>
                
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

const LoopingBgVid = ({src, image}) => {
    const ref = useRef();
    const handCanPlay = () => {
        gsap.to(ref.current, {alpha: 1});
    }

    useEffect(()=>{
        gsap.set(ref.current, {alpha: 0});
    }, []);
    
    return (
        <div className="video-bg">
            {image &&
            <div className="image" style={{backgroundImage: `url(<%= path %>/${image})`}} ></div>
            }
            {src && 
            <video ref={ref} src={`<%= path %>/${src}`} loop muted='true' autoPlay width="400" height="200" playsInline onCanPlayThrough={handCanPlay}></video>
            }
        </div>
    )
}

const BgVidSection = ({src, title}) =>
    <section className="bg-vid-container">
        <LoopingBgVid src={src} />
        <header {...setHtml(title)}>
            <h1 className="text-bg"><span>The Early Adopter </span></h1>
            <h2>Making positive environmental choices for future generations</h2>
        </header>
    </section>


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


const VideoPlayer = () => {

    const playerRef = useRef();
    const videoRef = useRef();

    // videojs.options.bigPlayButton = false;
    videojs.options.html5 = {

        nativeTextTracks: false,
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        hls: {
          overrideNative: true
        }

    }

    useEffect(()=>{
        // https://videojs.com/guides/layout/
        if (!playerRef.current) {

            if (!videoRef.current) return;
            const player = playerRef.current = videojs(videoRef.current, {
                inactivityTimeout: 0,       
            });
            // player.autoplay(true)
            player.src({
                // src: '/assets/video/out.mpd',
                // type: 'application/dash+xml'
                // https://stackoverflow.com/questions/29351225/playing-with-video-js-ustream-m3u8-file-streaming
                src: `${assetsPath}/video/agoods-720.m3u8`,
                type: 'application/x-mpegURL'
              });
            // player.src('/assets/video/bethechange.mp4');
            // player.on('ended',(e)=>{
            //     // console.log('END', e);
            //     setVideoEnded(true);
            //     player.one('timeupdate',(e)=>{
            //         // console.log(e);
            //         setVideoEnded(false);
            //     });                
            // });

            player.on('loadedmetadata',()=>{
                const dur = player.duration();
                console.log('duration', dur);
                
            });
        }

    },[videoRef])    

    return (
        <div className="video-player">
            <video ref={videoRef} controls playsInline className={`video-js vjs-fill`} >
            {/* <track kind="metadata" src="/assets/video/meta.vtt"/> */}
            </video>
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


                        <BgVidSection src="2022_04_Guardian_AdamGoodes_loops_2.mp4" title={content.s1Head}/>

                        {/* <Brother /> */}

                        <section className={`container`} >

                            <div className="wrap">

                                <div className="content">
                                                <div {...setHtml(content.s1Block1)}><p>Adam Goodes may be best known as a champion AFL footballer, but he is also committed to the future of our planet. 
                                        Goodes is a Toyota ambassador of National Tree Day: a beloved institution that’s become Australia’s largest community tree-planting and nature care event. Every year, the event attracts more than 300,000 participants from schools, councils, community groups and Toyota dealerships. Together, they are responsible for planting more than 26 million native trees, shrubs and grasses.
                                        Two-thirds of National Tree Day participants are schools, and Goodes is excited about how it helps children understand the impact they can have when they work together. “What better way to build our future than by providing brand new narratives into our local communities for future generations to benefit from?”</p>
                                            </div>
                                </div>
                            </div>    
                        </section>
                        
                        <section className="">
                            <div>

                                <div className="quote-block">
                                    <div className="quote">
                                        <h1 className="text-fill-bg">
                                            <span {...setHtml(content.s1Quote)}></span>
                                        </h1>
                                    </div>
                                    <div className="vis">
                                        <img src={`${assetsPath}/img_1.jpg`} alt="" />
                                    </div>
                                </div>
                                <div className="wrap">
                                    <div className="content"></div>
                                </div>
                            </div>
                        </section>

                        <BgVidSection src="2022_04_Guardian_AdamGoodes_loops_3.mp4" title={content.s3Head} />

                        <section className={`container`} >
                            <div className="wrap">
                                <div className="content">
                                        <div {...setHtml(content.s3Block1)}>
                                        </div>
                                        <div {...setHtml(content.photoCredits)}></div>
                                </div>

                            </div>    
                        </section>
                        <section>

                                    <div className="wrap">
                                        <img src={`${assetsPath}/img_5.jpg`} />
                                        <div className="content">
                                            
                                        </div>

                                    </div>
                        </section>
                        
                        <VideoPlayer />

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

