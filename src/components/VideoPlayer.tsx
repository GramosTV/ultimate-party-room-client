import React, { ChangeEvent, ChangeEventHandler, useContext, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { SourceProps } from "react-player/base";
import { findDOMNode } from "react-dom";
import screenfull from "screenfull";
import Duration from "./Duration";
import { SocketContext } from "../context/Socket";
import { VideoState } from "types";
interface Player {
  url?: string | string[] | SourceProps[] | MediaStream | undefined;
  pip?: boolean | undefined;
  playing?: boolean | undefined;
  controls?: boolean | undefined;
  light?: string | boolean | undefined;
  volume?: number | undefined;
  muted?: boolean | undefined;
  loop?: boolean | undefined;
  playbackRate?: number | undefined;
  played?: number | undefined;
  loaded?: number | undefined;
  duration?: number | undefined;
  seeking?: number | boolean | undefined;
  playedSeconds?: number | undefined;
  loadedSeconds?: number | undefined;
}
interface VideoPlayerProps {
  room: string;
}
// PLEASE DON'T TELL JAKUB KRÓL ABOUT THE ANY's HERE, the example js code from the react-player package is pretty old that's why I had to skip types for some of the stuff here, forgive me.
export function VideoPlayer(props: VideoPlayerProps) {
  const {room} = props 
  const socket = useContext(SocketContext);
  const [playerState, setPlayerState] = useState<Player>({
    url: undefined,
    pip: false,
    playing: true,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  });
  useMemo(() => {
    socket.on("videoState", (videoState: VideoState) => {
      if (videoState === VideoState.pause) {
        setPlayerState((actualState) => {
          return { ...actualState, playing: false };
        });
      } else if (videoState === VideoState.play) {
        setPlayerState((actualState) => {
          return { ...actualState, playing: true };
        });
      }
    });
    socket.on("updateVideoUrl", (videoUrl: string) => {
      setPlayerState((prevState) => ({...prevState, url: videoUrl }));
    });
    socket.on("videoMoment", (videoMoment: number) => {
      (player.current as any).seekTo(parseFloat(String(videoMoment)));
    });
    socket.emit("getVideoUrl", {roomId: room}, (videoUrl: string) => {
      setPlayerState((prevState) => ({...prevState, url: videoUrl }));
    });
  }, []);
  const {
    url,
    playing,
    controls,
    light,
    volume,
    muted,
    loop,
    played,
    loaded,
    duration,
    playbackRate,
    pip,
  } = playerState;
  const player = useRef(null);
  const load = (
    url: string | string[] | SourceProps[] | MediaStream | undefined
  ) => {
    setPlayerState((actualState) => {
      return { ...actualState, url, played: 0, loaded: 0, pip: false };
    });
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerState((actualState) => {
      return { ...actualState, volume: parseFloat(e.target.value) };
    });
  };
  const handlePlayPause = () => {
    setPlayerState((actualState) => {
      return { ...actualState, playing: !actualState.playing };
    });
  };

  const handleStop = () => {
    setPlayerState((actualState) => {
      return { ...actualState, url: undefined, playing: false };
    });
  };

  const handlePause = () => {
    socket.emit(
      "videoState",
      { roomId: room, videoState: VideoState.pause },
      () => {
        return null;
      }
    );
    setPlayerState((actualState) => {
      return { ...actualState, playing: false };
    });
  };

  const handlePlay = () => {
    socket.emit(
      "videoState",
      { roomId: room, videoState: VideoState.play },
      () => {
        return null;
      }
    );
    setPlayerState((actualState) => {
      return { ...actualState, playing: true };
    });
  };

  const handleSeekMouseDown = (e: any) => {
    setPlayerState((actualState) => {
      return { ...actualState, seeking: true, playing: false };
    });
  };

  const handleSeekChange = (e: any) => {
    setPlayerState((actualState) => {
      return { ...actualState, played: parseFloat(e.target.value) };
    });
  };

  const handleSeekMouseUp = (e: any) => {
    socket.emit("videoMoment", {
      roomId: room,
      videoMoment: playerState.played,
    });
    socket.emit("updateVideoMoment", {
      roomId: room,
      videoMoment: playerState.played,
    });
      setPlayerState((actualState) => {
        return { ...actualState, seeking: false, playing: true };
      });
    (player.current as any).seekTo(parseFloat(e.target.value));
  };

  const handleProgress = (state: any) => {
    console.log("progress");
    if (!playerState.seeking) {
      setPlayerState((actualState) => {
        return { ...actualState, ...state };
      });
      socket.emit("updateVideoMoment", {
        roomId: room,
        videoMoment: playerState.played,
      })
    }
  };

  const handleClickFullscreen = () => {
    screenfull.request(findDOMNode(player.current as any) as any);
  };
  const handleDuration = (duration: any) => {
    setPlayerState((actualState) => {
      return { ...actualState, duration };
    });
  };
  const handleUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.currentTarget.value)
    socket.emit("updateVideoUrl", {
      roomId: room,
      videoUrl: e.currentTarget.value,
    })
  }
  const [urlInput, setUrlInput] = useState('')
  return (
    <>
      <input
        type="range"
        min={0}
        max={1}
        step="any"
        value={volume}
        onChange={handleVolumeChange}
      />
      <button onClick={handleStop}>Stop</button>
      <button onClick={handlePlayPause}>{playing ? "Pause" : "Play"}</button>
      <button onClick={handleClickFullscreen}>Fullscreen</button>
      <tr>
        <th>Custom URL</th>
        <td>
          <input
            value={urlInput}
            onChange={handleUrlInputChange}
            type="text"
            placeholder="Enter URL"
          />
          <button onClick={() => {setPlayerState((prevState) => ({...prevState, url: urlInput })); setUrlInput('')}}>
            Load
          </button>
        </td>
      </tr>
      <ReactPlayer
        ref={player}
        className="react-player"
        width="640px"
        height="320px"
        url={url}
        pip={pip}
        playing={playing}
        controls={controls}
        light={light}
        loop={loop}
        playbackRate={playbackRate}
        volume={volume}
        muted={muted}
        onReady={() => console.log("onReady")}
        onStart={() => {console.log("onStart");
        socket.emit("getVideoMoment", {roomId: room}, (videoMoment: number) => {
          (player.current as any).seekTo(parseFloat(String(videoMoment)))
        });
        }}
        onPlay={handlePlay}
        // onEnablePIP={this.handleEnablePIP}
        // onDisablePIP={this.handleDisablePIP}
        onPause={handlePause}
        onBuffer={() => console.log("onBuffer")}
        // onPlaybackRateChange={this.handleOnPlaybackRateChange}
        onSeek={(e: any) => console.log("onSeek", e)}
        // onEnded={this.handleEnded}
        onError={(e: any) => console.log("onError", e)}
        onProgress={handleProgress}
        onDuration={handleDuration}
        progressInterval={500}
      />
      <td>
        <input
          type="range"
          min={0}
          max={0.999999}
          step="any"
          value={played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
        />
      </td>
      <span>elapsed</span>
      <td>
        <Duration seconds={duration && played ? duration * played : null} />
      </td>
    </>
  );
}
