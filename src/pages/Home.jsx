import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './Player.css';
import { Logo } from '../images/Netflix';
import {
  ConnectButton,
  TabList,
  Tab,
  Button,
  Modal,
  useNotification,
} from 'web3uikit';
import { movies } from '../helpers/library';
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
        <Logo></Logo> 
      </div>
      <div className="connect">
        
        <ConnectButton />
      </div>
      <div className="topBanner">
        <TabList style={{zIndex:3}} defaultActiveKey={1} tabStyle="bar">
          <Tab></Tab>
          <Tab tabKey={7} tabName={"   "} style={{zIndex:1}}></Tab>
          <Tab tabKey={6} tabName={"   "} style={{zIndex:1}}></Tab>
          <Tab tabKey={5} tabName={""} style={{zIndex:1}}></Tab>
          <Tab tabKey={4} tabName={""} style={{zIndex:1}}></Tab>
          <Tab tabKey={1} tabName={"Catalog"} style={{zIndex:3}}>
            <div className="scene">
            <div>
              <p>
                
              </p>
            </div>
              <img src={movies[0].Scene} className="sceneImg" alt=""></img>
              <img className="sceneLogo" src={movies[0].Logo} alt=""></img>
              <p className="sceneDesc">{movies[0].Description}</p>
              




              
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




          <Tab tabKey={3} tabName={"MyList"} style={{zIndex:3}}>
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
                  You need to Authenicate to view your own list
                </div>
              )}
            </div>
          </Tab>
        </TabList>
        {selectedFilm && (
          <div className="modal">
            <Modal
              onCloseButtonPressed={() => setVisible(false)}
              isVisible={visible}
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
                      <Button
                        icon="plus"
                        text="Generate Token"
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
                        text="Movie Token"
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
                    <div>

                    </div>
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
