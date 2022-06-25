import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReactPlayer from 'react-player/lazy'
import { SourceProps } from 'react-player/base'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import Duration from './Duration'
import { SocketContext } from '../context/Socket'
import {
  UserVideoAction,
  VideoMomentAction,
  VideoState,
  VideoStateAction,
  VideoUrlAction,
} from 'types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExpand,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons'
import { VideoUpload } from './VideoUpload'
import { UserVideoActionEntity } from 'src/types/user-video.action'
import { toast } from 'react-toastify'
export interface Player {
  url?: string | string[] | SourceProps[] | MediaStream | undefined
  pip?: boolean | undefined
  playing?: boolean | undefined
  controls?: boolean | undefined
  light?: string | boolean | undefined
  volume?: number | undefined
  muted?: boolean | undefined
  loop?: boolean | undefined
  playbackRate?: number | undefined
  played?: number | undefined
  loaded?: number | undefined
  duration?: number | undefined
  seeking?: number | boolean | undefined
  playedSeconds?: number | undefined
  loadedSeconds?: number | undefined
}
interface VideoPlayerProps {
  room: string
  setUserVideoAction: Dispatch<SetStateAction<UserVideoActionEntity | undefined>>
}
// PLEASE DON'T TELL JAKUB KRÓL ABOUT THE ANY's HERE, the example js code from the react-player package is pretty old that's why I had to skip types for some of the stuff here, forgive me.
export function VideoPlayer({ room, setUserVideoAction }: VideoPlayerProps) {
  const socket = useContext(SocketContext)
  const [playerState, setPlayerState] = useState<Player>({
    url: undefined,
    pip: false,
    playing: true,
    controls: false,
    light: false,
    volume: 0.7,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  })
  const player = useRef(null)
  const videoMomentFlag = useRef(false)
  useEffect(() => {
    setPlayerState((prevState) => ({ ...prevState, url: undefined }))
    setPlayerState((actualState) => {
      return { ...actualState, playing: true }
    })
    socket.on('videoState', ({ videoState, user }: VideoStateAction) => {
      setUserVideoAction({ userVideoAction: Number(videoState), user })
      setPlayerState((actualState) => {
        return { ...actualState, playing: Boolean(videoState) }
      })
      if (videoState === VideoState.pause) {
        socket.emit('getVideoMoment', { roomId: room }, (videoMoment: number) => {
          ;(player.current as any).seekTo(parseFloat(String(videoMoment)))
        })
      }
    })
    socket.on('updateVideoUrl', ({ videoUrl, user }: VideoUrlAction) => {
      socket.emit('updateVideoMoment', {
        videoMoment: 0,
      })
      setUserVideoAction({ userVideoAction: UserVideoAction.url, user })
      setPlayerState((prevState) => ({ ...prevState, url: videoUrl }))
      ;(player.current as any).seekTo(parseFloat(String(0)))
      socket.emit('getVideoMoment', { roomId: room }, (videoMoment: number) => {
        ;(player.current as any).seekTo(parseFloat(String(videoMoment)))
      })
    })
    socket.emit('getVideoUrl', {}, (videoUrl: string) => {
      setPlayerState((prevState) => ({ ...prevState, url: videoUrl }))
      socket.emit('getVideoState', { roomId: room }, (videoState: VideoState) => {
        setPlayerState((prevState) => ({
          ...prevState,
          playing: Boolean(videoState),
        }))
      })
    })
    socket.on('videoMoment', ({ videoMoment, user }: VideoMomentAction) => {
      setUserVideoAction({ userVideoAction: UserVideoAction.forward, user })
      ;(player.current as any).seekTo(parseFloat(String(videoMoment)))
    })
  }, [room])
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
  } = playerState
  const load = (url: string | string[] | SourceProps[] | MediaStream | undefined) => {
    setPlayerState((actualState) => {
      return { ...actualState, url, played: 0, loaded: 0, pip: false }
    })
  }
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerState((actualState) => {
      return { ...actualState, volume: parseFloat(e.target.value) }
    })
  }
  const handlePlayPause = () => {
    setPlayerState((actualState) => {
      socket.emit('videoState', { roomId: room, videoState: !actualState.playing })
      return { ...actualState, playing: !actualState.playing }
    })
  }

  const handleStop = () => {
    // setPlayerState((actualState) => {
    //   return { ...actualState, url: undefined, playing: false };
    // });
  }

  const handlePause = () => {
    // socket.emit('videoState', { roomId: room, videoState: VideoState.pause });
    setPlayerState((actualState) => {
      return { ...actualState, playing: false }
    })
    socket.emit('getVideoMoment', { roomId: room }, (videoMoment: number) => {
      ;(player.current as any).seekTo(parseFloat(String(videoMoment)))
    })
  }

  const handlePlay = () => {
    // socket.emit('videoState', { roomId: room, videoState: VideoState.play });
    setPlayerState((actualState) => {
      return { ...actualState, playing: true }
    })
  }

  const handleSeekMouseDown = (e: any) => {
    setPlayerState((actualState) => {
      return { ...actualState, seeking: true, playing: false }
    })
  }

  const handleSeekChange = (e: any) => {
    setPlayerState((actualState) => {
      return { ...actualState, played: parseFloat(e.target.value) }
    })
  }

  const handleSeekMouseUp = (e: any) => {
    if (!String(playerState.url).includes('http://localhost')) {
      setPlayerState((actualState) => {
        return { ...actualState, seeking: false, playing: true }
      })
      socket.emit('videoMoment', {
        roomId: room,
        videoMoment: playerState.played,
      })
      socket.emit('updateVideoMoment', {
        roomId: room,
        videoMoment: playerState.played,
      })
      ;(player.current as any).seekTo(parseFloat(e.target.value))
    } else {
      toast.warn('Video forwarding is not yet supported on localhost videos', {
        theme: 'colored',
      })
      setPlayerState((actualState) => {
        return { ...actualState, seeking: false, playing: true }
      })
    }
  }

  const handleProgress = (state: any) => {
    console.log('progress')
    if (!playerState.seeking) {
      setPlayerState((actualState) => {
        return { ...actualState, ...state }
      })
      if (videoMomentFlag.current) {
        socket.emit('updateVideoMoment', {
          roomId: room,
          videoMoment: playerState.played,
        })
      }
    }
  }

  const handleClickFullscreen = () => {
    // eslint-disable-next-line react/no-find-dom-node
    screenfull.request(findDOMNode(player.current as any) as any)
  }
  const handleClickVolume = () => {
    if (playerState.volume === 0) {
      setPlayerState((actualState) => {
        return { ...actualState, volume: 0.7 }
      })
    } else {
      setPlayerState((actualState) => {
        return { ...actualState, volume: 0 }
      })
    }
  }
  const handleDuration = (duration: any) => {
    setPlayerState((actualState) => {
      return { ...actualState, duration }
    })
  }
  const handleUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.currentTarget.value)
  }
  const [urlInput, setUrlInput] = useState('')
  const [soundInput, setSoundInput] = useState(false)
  const handleSoundInput = (boolean: boolean) => {
    setSoundInput(boolean)
  }
  return (
    <>
      <div className='playerContainer'>
        <div>
          <div className='videoInputContainer'>
            <div className='urlContainer'>
              <span className='gradientText small'>Custom URL</span>
              <div>
                <input
                  value={urlInput}
                  onChange={handleUrlInputChange}
                  type='text'
                  placeholder='Enter URL'
                  className='input'
                />
                <button
                  className='confirmBtn'
                  onClick={() => {
                    // socket.emit('videoMoment', {
                    //   videoMoment: 0,
                    //   hidden: true,
                    // });
                    socket.emit('updateVideoMoment', {
                      videoMoment: 0,
                    })
                    setPlayerState((prevState) => ({
                      ...prevState,
                      url: urlInput,
                    }))
                    setUrlInput('')
                    socket.emit('updateVideoUrl', {
                      videoUrl: urlInput,
                    })
                    ;(player.current as any).seekTo(parseFloat(String(0)))
                    socket.emit('getVideoMoment', { roomId: room }, (videoMoment: number) => {
                      ;(player.current as any).seekTo(parseFloat(String(videoMoment)))
                    })
                  }}
                >
                  Load
                </button>
              </div>
            </div>
            <VideoUpload room={room} setPlayerState={setPlayerState} />
          </div>
          <ReactPlayer
            ref={player}
            className='react-player'
            width={`${640 * 1.3}px`}
            height={`${320 * 1.3}px`}
            url={url}
            pip={pip}
            playing={playing}
            controls={controls}
            light={light}
            loop={loop}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onReady={() => {
              socket.emit('getVideoState', { roomId: room }, (videoState: VideoState) => {
                setPlayerState((prevState) => ({
                  ...prevState,
                  playing: Boolean(videoState),
                }))
              })
              socket.emit('getVideoMoment', { roomId: room }, (videoMoment: number) => {
                if (!String(playerState.url).includes('http://localhost')) {
                  ;(player.current as any).seekTo(parseFloat(String(videoMoment)))
                }
                setTimeout(() => {
                  videoMomentFlag.current = true
                }, 1000)
              })
            }}
            onStart={() => {
              console.log('onStart')
            }}
            onPlay={handlePlay}
            // onEnablePIP={this.handleEnablePIP}
            // onDisablePIP={this.handleDisablePIP}
            onPause={handlePause}
            onBuffer={() => console.log('onBuffer')}
            // onPlaybackRateChange={this.handleOnPlaybackRateChange}
            onSeek={(e: any) => console.log('onSeek', e)}
            // onEnded={this.handleEnded}
            onError={(e: any) => console.log('onError', e)}
            onProgress={handleProgress}
            onDuration={handleDuration}
            progressInterval={250}
          />
          <div className='timeline'>
            <Duration seconds={duration && played ? duration * played : null} />
            <input
              type='range'
              min={0}
              max={0.999999}
              step='any'
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
            />
            <aside>
              <input
                type='range'
                min={0}
                max={1}
                step='any'
                className='volume'
                value={volume}
                onChange={handleVolumeChange}
                onMouseOver={() => handleSoundInput(true)}
                onMouseOut={() => handleSoundInput(false)}
                style={{ display: soundInput ? 'block' : 'none' }}
              />
              <div>
                {/* <button onClick={handleStop}></button> */}
                <button onClick={handleClickVolume}>
                  {(() => {
                    if (playerState.volume) {
                      if (playerState.volume >= 0.275) {
                        return (
                          <FontAwesomeIcon
                            icon={faVolumeHigh}
                            onMouseOver={() => handleSoundInput(true)}
                            onMouseOut={() => handleSoundInput(false)}
                          />
                        )
                      } else {
                        return (
                          <FontAwesomeIcon
                            icon={faVolumeLow}
                            onMouseOver={() => handleSoundInput(true)}
                            onMouseOut={() => handleSoundInput(false)}
                          />
                        )
                      }
                    }
                    return (
                      <FontAwesomeIcon
                        icon={faVolumeOff}
                        onMouseOver={() => handleSoundInput(true)}
                        onMouseOut={() => handleSoundInput(false)}
                      />
                    )
                  })()}
                </button>
                <button onClick={handlePlayPause}>
                  {playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                </button>
                <button onClick={handleClickFullscreen}>
                  <FontAwesomeIcon icon={faExpand} />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
