import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import './Home.css';
import './Player.css';
import { Logo } from '../images/Netflix';
import {
  ConnectButton,
  Icon,
  TabList,
  Tab,
  Button,
  Modal,
  useNotification,
} from 'web3uikit';
import { movies } from '../helpers/library';
import { networkCollections } from '../helpers/collections';
import { useState } from 'react';
import { useMoralis } from 'react-moralis';


const Home = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const { isAuthenticated, Moralis, account } = useMoralis();
  const [myMovies, setMyMovies] = useState();

  //const { NFT, PlanCard} = useEffect;

  useEffect(() => {
    async function fetchMyList() {
         await Moralis.start({
         serverUrl: "https://if2xxpzacmpo.usemoralis.com:2053/server",
         appId: "M63Svb49HZGjjHfN12sIt3IXcMEKKK3KZri2Tcli",
       }); //if getting errors add this 
       console.log(account)
      const theList = await Moralis.Cloud.run("getMyList",{addrs: account})
      const filterA = movies.filter(function (e) {
        return theList.indexOf(e.Name) > -1;
      })
      setMyMovies(filterA)  
    }
    if(isAuthenticated) {
      fetchMyList();  
    }
    console.log(isAuthenticated);    
  },[account, Moralis, isAuthenticated])


  const dispatch = useNotification();

  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "Pleaser Connect Your Crypto Wallet",
      title: "Not Authenticated",
      position: "topL",
    });
  };

  const handleAddNotification = () => {
    dispatch({
      type: "success",
      message: "Movie Added to List",
      title: "Success",
      position: "topL",
    });
  };

  return (
    <>
      <div className="logo">
        <Logo />
      </div>
      <div className="connect">
        <Icon fill="#ffffff" size={24} svg="bell" />
        <ConnectButton />
      </div>
      <div className="topBanner">
      
      <container>
      
        <TabList defaultActiveKey={4} tabStyle="bar" isVertical margin-left={1} border-box margin={0} padding={0} z-index={9}>
        <h1>
        <div>
          
        </div>
      </h1>
          <Tab tabKey={0} tabName={""}/>
          <Tab tabKey={4} tabName={"Home"}>
          <div className="scene"><img src={"https://i.imgur.com/08VzwnC.png"}></img></div>
          </Tab>
          <Tab tabKey={1} tabName={"Movies"}>
            <div className="scene">
              <img src={"https://i.imgur.com/tU9ZawK.png"}></img>
              
            

            </div>

            <div className="title">Movies</div>
            <div className="thumbs">
              {movies &&
                movies.map((e, i) => {
                  return (
                    <img
                      src={e.Thumnbnail}
                      className="thumbnail" alt="" key={i}
                      onClick={() => {
                        setSelectedFilm(e);
                        setVisible(true);
                      }}
                    ></img>
                  );
                })}
            </div>
           
          </Tab>
          <Tab tabKey={2} tabName={"NFTs"}>
            <div className="scene">
              <img src={"https://i.imgur.com/aa1fW5I.png"}></img>  
            </div>

            <div className="title">Buy NFTs</div>
            <div className="thumbs">
              {movies &&
                movies.map((e, i) => {
                  return (
                    <img
                      src={"https://i.imgur.com/hIVW5Bb.png"}
                      className="thumbnail" alt="" key={i}
                      onClick={() => {
                        
                        //getCollectionsByChain();
                        //setSelectedFilm(e);
                        setVisible(true);
                      }}
                    ></img>
                  );
                })}
            </div>
          </Tab>
          <Tab tabKey={3} tabName={"MyList"}>
          <img src={"https://i.imgur.com/8IoDtmx.png"}></img>  
            
            <div className="ownListContent">
              <div className="title">Your Library</div>
              {myMovies && isAuthenticated ? (
                <>
                  <div className="ownThumbs">
                    {
                      myMovies.map((e,i) => {
                        return (
                          <img
                            src={e.Thumnbnail}
                            className="thumbnail" alt="" key={i}
                            onClick={() => {
                              setSelectedFilm(e);
                              setVisible(true);
                            }}
                          ></img>
                        );
                      })}
                  </div>
                </>
              ) : (
                <div className="ownThumbs">
                  You need to Authenicate TO View Your Own list
                </div>
              )}
            </div>
          </Tab>
          
        </TabList>

        </container>
        
        {selectedFilm && (
          <div className="modal">
            
            <Modal
              onCloseButtonPressed={() => setVisible(false)}
              isVisible={visible}             //change to true    "Date: 01 06 22"
              hasFooter={false}
              width="1000px"
              
              
              
            >

              <div className="modalContent">
                <img src={selectedFilm.Scene} className="modalImg" alt=""></img>
                <img className="modalLogo" src={selectedFilm.Logo} alt=""></img>
                <div className="modalPlayButton">
                  {isAuthenticated ? (
                    <>
                      <Link to="/player" state={selectedFilm.Movie}>
                        <Button
                          icon="chevronRightX2"
                          text="Play"
                          theme="secondary"
                          type="button"
                        />
                     </Link>

                    <div className="backHome">
                      <Link to="/">
                        <Icon 
                        className="backButton" 
                        fill="rgba(255,255,255,0.25)" 
                        size={60} 
                        svg="arrowCircleLeft" 
                       />
                    </Link>

                      </div>
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={async () => {
                          await Moralis.Cloud.run("updateMyList", {
                            addrs: account,
                            newFav: selectedFilm.Name,
                          });
                          handleAddNotification();
                        }}
                      />
   
   
                    </>
                  ) : (
                    <>
                      <Button
                        icon="chevronRightX2"
                        text="Play"
                        theme="secondary"
                        type="button"
                        onClick={handleNewNotification}
                      />
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification}
                      />
                    </>
                  )}
                </div>
                <div className="movieInfo">
                  <div className="description">
                    <div className="details">
                      <span>{selectedFilm.Year}</span>
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
                  </div>
                  <div className="detailedInfo">
                    Genre:
                    <span className="deets">{selectedFilm.Genre}</span>
                    <br />
                    Actors:
                    <span className="deets">{selectedFilm.Actors}</span>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
