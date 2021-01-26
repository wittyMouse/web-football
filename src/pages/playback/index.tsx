import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { requestRecordList, requestFirstRecordDate } from "./service";
import { requestAdConfigInfo } from "../../service";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import "../../assets/css/audio.css";

interface PlaybackProps {}

interface AudioConfig {
  title?: string;
  cover?: string;
  src?: string;
}

interface Position {
  x: number;
  y: number;
}

const getMinuteBySecond = (duration: number) => {
  let minute = Math.floor(duration / 60).toString();
  let second = Math.floor(duration % 60).toString();
  minute = minute[1] ? minute : `0${minute}`;
  second = second[1] ? second : `0${second}`;
  return `${minute}:${second}`;
};

const monthList = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

const getCurerentDate = () => {
  const date = new Date();
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
};

const Playback: React.FC<PlaybackProps> = () => {
  const audioRef = useRef(null);
  const { token, isLogin } = useSelector((state: RootState) => state.global);
  const [recordListLoading, setRecordListLoading] = useState<boolean>(false);
  const [firstRecordDateLoading, setFirstRecordDateLoading] = useState<boolean>(
    false
  );

  const now = getCurerentDate();
  const [currentDate, setCurrentDate] = useState<number>(now);
  const [selectedDate, setSelectedDate] = useState<number>(now);
  const [recordList, setRecordList] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [isMore, setIsMore] = useState<boolean>(false);
  const [yearList, setYearList] = useState<number[]>([]);

  const [audioList, setAudioList] = useState<AudioConfig[]>([]);
  const [currentAudio, setCurrentAudio] = useState<AudioConfig>({});
  const [currentAudioTime, setCurrentAudioTime] = useState<number>(0);
  const [currentAudioAllTime, setCurrentAudioAllTime] = useState<number>(0);
  const [audioProcess, setAudioProcess] = useState<number>(0);
  const [volumeProcess, setVolumeProcess] = useState<number>(100);
  const [playing, setPlaying] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [headerAdv, setHeaderAdv] = useState<any>([]);
  const [footerAdv, setFooterAdv] = useState<any>([]);

  const currentAudioTimeMemo = useMemo(
    () => getMinuteBySecond(currentAudioTime),
    [currentAudioTime]
  );

  const currentAudioAllTimeMemo = useMemo(
    () => getMinuteBySecond(currentAudioAllTime),
    [currentAudioAllTime]
  );

  let audioStart = false;
  let audioPosition = {
    x: 0,
    y: 0,
  };

  let volumeStart = false;
  let volumePosition = {
    x: 0,
    y: 0,
  };

  // 获取一个月的总天数
  const getDaysOfMonth = (timestamp: number) => {
    const date = new Date(timestamp);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.getDate();
  };

  const getAudioBySecond = (duration: number) => {
    let minute = Math.floor(duration / 60).toString();
    let second = Math.floor(duration % 60).toString();
    minute = minute[1] ? minute : `0${minute}`;
    second = second[1] ? second : `0${second}`;
    return `${minute}:${second}`;
  };

  /**
   * 获取最早的录音时间
   */
  const getFirstRecordDate = () => {
    setFirstRecordDateLoading(true);
    requestFirstRecordDate()
      .then((res) => {
        if (res.data.code === 0) {
          const firstRecordDate = res.data.result;
          const firstRecordYear = Number(firstRecordDate.split("-")[0]);
          const currentYear = new Date(currentDate).getFullYear();
          const yearList: number[] = [currentYear];
          for (let i = 0; i < currentYear - firstRecordYear; i++) {
            yearList.push(currentYear - (i + 1));
          }
          setYearList(yearList);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setFirstRecordDateLoading(false);
      });
  };

  /**
   * 获取录音回放列表
   */
  const getRecordList = () => {
    setRecordListLoading(true);
    requestRecordList({
      token,
      queryTime: dayjs(selectedDate).format("YYYY-MM"),
    })
      .then((res) => {
        if (res.data.code === 0) {
          const recordList = res.data.result;
          setRecordList(recordList);

          // 获取选中月份的天数
          let days = getDaysOfMonth(selectedDate);
          const current = new Date(currentDate);
          const currentYear = current.getFullYear();
          const currentMonth = current.getMonth() + 1;
          const currentDay = current.getDate();
          const selected = new Date(selectedDate);
          const selectedYear = selected.getFullYear();
          const selectedMonth = selected.getMonth() + 1;
          if (currentYear === selectedYear && currentMonth === selectedMonth) {
            days = currentDay;
          }

          // 获取电台总数
          const size = recordList.length;

          // 初始化列表结构
          const dataSource: any = [];
          for (let i = 0; i < days; i++) {
            // 获取当前选中月份
            const month = dayjs(selectedDate).format("MM");

            // 生成日期
            let date: any = "";
            if (dayjs(selectedDate).isSame(dayjs(currentDate))) {
              const d = new Date(selectedDate).getDate();
              if (i === 0) {
                date = dayjs(selectedDate).format("DD");
              } else {
                date = days - i + 1;
                if (date <= d) {
                  date -= 1;
                }
                date = date.toString();
                date = date[1] ? date : `0${date}`;
              }
            } else {
              date = (days - i).toString();
              date = date[1] ? date : `0${date}`;
            }

            const row = new Array(size).fill("");
            row.unshift(month + date);
            dataSource.push(row);
          }

          const columns = recordList.map((item: any, idx: number) => {
            const { itemName, itemImage, itemDesc, recordMap } = item;
            Object.keys(recordMap).forEach((key: string) => {
              const date = Number(key.split("-")[1]);
              if (dayjs(selectedDate).isSame(dayjs(currentDate))) {
                if (dayjs(selectedDate).format("MM-DD") === key) {
                  dataSource[0][idx + 1] = recordMap[key];
                } else {
                  dataSource[days - date][idx + 1] = recordMap[key];
                }
              } else {
                dataSource[days - date][idx + 1] = recordMap[key];
              }
            });

            // 返回电台详情（表头）
            return { itemName, itemImage, itemDesc };
          });
          setColumns(columns);
          setDataSource(dataSource);
        } else {
          console.error(res.data.message);
        }
      })
      .finally(() => {
        setRecordListLoading(false);
      });
  };

  // 修改选中时间
  const onDateChange = (date: number) => {
    setSelectedDate(date);
    setIsMore(false);
  };

  // 显示全部
  const showMore = () => {
    setIsMore(true);
  };

  // 播放
  const onPlayClick = (audioDetail: any) => {
    console.log(audioDetail);
    setPlaying(true);
    setAudioList((_audioList: any) => {
      const idx = _audioList.findIndex(
        (item: any) => item.src === audioDetail.src
      );
      let audioList = [];

      if (idx > -1) {
        audioList = _audioList;
        (audioRef.current as any).play();
        setCurrentAudio((_audioDetail) => {
          if (_audioDetail.src === audioDetail.src) {
            return _audioDetail;
          } else {
            return audioDetail;
          }
        });
      } else {
        audioList = [..._audioList, audioDetail];
        (audioRef.current as any).src = audioDetail.src;
        setCurrentAudio(audioDetail);
      }
      return audioList;
    });
  };

  // 切换音频
  const onAudioChange = (idx: number) => {
    const _currentAudio = audioList[idx];
    if (currentAudio.src === _currentAudio.src) {
      (audioRef.current as any).play();
    } else {
      (audioRef.current as any).src = _currentAudio.src;
      setCurrentAudio(_currentAudio);
    }
    setPlaying(true);
  };

  // 上一首
  const onAudioPrevClick = () => {
    const len = audioList.length;
    if (playing && len > 1) {
      const idx = audioList.findIndex((item) => item.src === currentAudio.src);
      let _currentAudio: AudioConfig = {};
      if (idx === 0) {
        _currentAudio = audioList[len - 1];
      } else {
        _currentAudio = audioList[idx - 1];
      }
      (audioRef.current as any).src = _currentAudio.src;
      setCurrentAudio(_currentAudio);
    }
  };

  // 开关
  const onAudioPlayClick = () => {
    if (!isEmpty(currentAudio)) {
      setPlaying((_playing) => {
        if (_playing) {
          (audioRef.current as any).pause();
        } else {
          (audioRef.current as any).play();
        }
        return !_playing;
      });
    }
  };

  // 下一首
  const onAudioNextClick = () => {
    const len = audioList.length;
    if (playing && len > 1) {
      const idx = audioList.findIndex((item) => item.src === currentAudio.src);
      let _currentAudio: AudioConfig = {};
      if (idx === len - 1) {
        _currentAudio = audioList[0];
      } else {
        _currentAudio = audioList[idx + 1];
      }
      (audioRef.current as any).src = _currentAudio.src;
      setCurrentAudio(_currentAudio);
    }
  };

  // 打开歌单
  const onAudioMenuClick = () => {
    setShowMenu((_showMenu) => !_showMenu);
    setShowVolume(false);
  };

  // 关闭歌单
  const onAudioMenuClose = () => {
    setShowMenu(false);
  };

  // 打开音量控制器
  const onAudioVolumeClick = () => {
    setShowVolume((_showVolume) => {
      return !_showVolume;
    });
    setShowMenu(false);
  };

  // 进度条鼠标按下事件
  const onAudioMouseDown = (e: any) => {
    e.preventDefault();
    e.target.focus();
    if (!isEmpty(currentAudio)) {
      (audioRef.current as any).pause();
      audioStart = true;
      audioPosition = {
        x: e.clientX,
        y: e.clientY,
      };
      window.document.addEventListener("mousemove", onAudioMouseMove);
      window.document.addEventListener("mouseup", onAudioMouseUp);
    }
  };

  // 进度条鼠标移动事件
  const onAudioMouseMove = (e: any) => {
    if (audioStart) {
      let _audioProcess = audioProcess + (e.clientX - audioPosition.x);
      if (_audioProcess > 580) {
        _audioProcess = 580;
      } else if (_audioProcess < 0) {
        _audioProcess = 0;
      }
      (audioRef.current as any).currentTime =
        (_audioProcess * currentAudioAllTime) / 580;
      setAudioProcess(_audioProcess);
    }
  };

  // 进度条鼠标抬起事件
  const onAudioMouseUp = () => {
    audioStart = false;
    (audioRef.current as any).play();
    window.document.removeEventListener("mousemove", onAudioMouseMove);
    window.document.removeEventListener("mouseup", onAudioMouseUp);
  };

  // 音量键鼠标按下事件
  function onVolumeMouseDown(e: any) {
    e.preventDefault();
    e.target.focus();
    volumeStart = true;
    volumePosition = {
      x: e.clientX,
      y: e.clientY,
    };
    window.document.addEventListener("mousemove", onVolumeMouseMove);
    window.document.addEventListener("mouseup", onVolumeMouseUp);
  }

  // 音量键鼠标移动事件
  function onVolumeMouseMove(e: any) {
    if (volumeStart) {
      let _volumeProcess = volumeProcess - (e.clientY - volumePosition.y);
      if (_volumeProcess > 100) {
        _volumeProcess = 100;
      } else if (_volumeProcess < 0) {
        _volumeProcess = 0;
      }
      (audioRef.current as any).volume = _volumeProcess / 100;
      setVolumeProcess(_volumeProcess);
    }
  }

  // 音量键鼠标抬起事件
  function onVolumeMouseUp() {
    volumeStart = false;
    window.document.removeEventListener("mousemove", onVolumeMouseMove);
    window.document.removeEventListener("mouseup", onVolumeMouseUp);
  }

  // 音频播放事件
  const onAudioPlay = (e: any) => {
    console.log(e);
    setPlaying(true);
    setCurrentAudioAllTime(e.target.duration);
  };

  // 音频暂停事件
  const onAudioPause = () => {
    setPlaying(false);
  };

  // 歌曲播放结束
  const onAudioEnded = () => {
    if (audioList.length > 1) {
      const idx = audioList.findIndex((item) => item.src === currentAudio.src);
      let _currentAudio: AudioConfig = {};
      if (idx === audioList.length - 1) {
        _currentAudio = audioList[0];
      } else {
        _currentAudio = audioList[idx + 1];
      }
      (audioRef.current as any).src = _currentAudio.src;
      setCurrentAudio(_currentAudio);
    } else {
      (audioRef.current as any).play();
    }
  };

  // 播放时间改变
  const onAudioTimeUpdate = (e: any) => {
    setCurrentAudioTime(e.target.currentTime);
    setAudioProcess((e.target.currentTime / e.target.duration) * 580);
  };

  const getAdConfigInfo = (cb: (result: any) => void) => {
    requestAdConfigInfo().then((res) => {
      if (res.data.code === 0) {
        cb && cb(res.data.result);
      } else {
        console.error(res.data.message);
      }
    });
  };

  useEffect(() => {
    getFirstRecordDate();
    getAdConfigInfo((result) => {
      if (result) {
        if (result[8]) {
          setHeaderAdv(result[8]);
        } else if (result[2]) {
          setHeaderAdv(result[2]);
        }
        if (result[9]) {
          setFooterAdv(result[9]);
        } else if (result[3]) {
          setFooterAdv(result[3]);
        }
      }
    });
  }, []);

  useEffect(() => {
    getRecordList();
  }, [selectedDate]);

  return (
    <div>
      <div className="audio-box">
        <audio
          ref={audioRef}
          autoPlay
          onPlay={onAudioPlay}
          onPause={onAudioPause}
          onEnded={onAudioEnded}
          onTimeUpdate={onAudioTimeUpdate}
        />
        <div className="audio-container">
          <div className="audio-view">
            <div className="audio-cover">
              {currentAudio.cover ? (
                <img src={currentAudio.cover} alt="cover" />
              ) : null}
            </div>
            <div className="audio-body">
              <h3 className="audio-title">
                {currentAudio.title ? currentAudio.title : "未知歌曲"}
              </h3>
              <div className="audio-backs">
                <div className="audio-this-time">{currentAudioTimeMemo}</div>
                <div className="audio-count-time">
                  {currentAudioAllTimeMemo}
                </div>
                <div className="audio-setbacks">
                  <i
                    className="audio-this-setbacks"
                    style={{ width: `${audioProcess}px` }}
                  >
                    <span
                      className="audio-backs-btn"
                      onMouseDown={onAudioMouseDown}
                    ></span>
                  </i>
                  <span className="audio-cache-setbacks"></span>
                </div>
              </div>
            </div>
            <div className="audio-btn">
              <div className="audio-select">
                <div className="audio-prev" onClick={onAudioPrevClick}></div>
                <div
                  className={`audio-play ${playing ? "audio-stop" : ""}`}
                  onClick={onAudioPlayClick}
                ></div>
                <div className="audio-next" onClick={onAudioNextClick}></div>
                <div
                  className={`audio-menu ${showMenu ? "menu-show" : ""}`}
                  onClick={onAudioMenuClick}
                ></div>
                <div
                  className={`audio-volume ${
                    showVolume ? "audio-show-volume" : ""
                  }`}
                  onClick={onAudioVolumeClick}
                ></div>
              </div>
              <div
                className={`audio-set-volume ${
                  showVolume ? "audio-show-volume" : ""
                }`}
              >
                <div className="volume-box">
                  <i style={{ height: `${volumeProcess}px` }}>
                    <span onMouseDown={onVolumeMouseDown}></span>
                  </i>
                </div>
                <div className="volume-mask"></div>
              </div>
              <div className={`audio-list ${showMenu ? "menu-show" : ""}`}>
                <div className="audio-list-head">
                  <p>歌单</p>
                  <span className="menu-close" onClick={onAudioMenuClose}>
                    关闭
                  </span>
                </div>
                <ul className="audio-inline">
                  {audioList?.map((item, idx, array) => {
                    return (
                      <li key={idx}>
                        <span
                          className={`cursor-pointer ${
                            currentAudio.src === array[idx].src ? "current" : ""
                          }`}
                          onClick={() => {
                            onAudioChange(idx);
                          }}
                        >
                          {item.title}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="top-gg box-s">
        <img
          className="cursor-pointer"
          src={headerAdv && headerAdv.length > 0 ? headerAdv[0].imageUrl : ""}
          alt="adv"
          onClick={() => {
            if (headerAdv[0].pageUrl) {
              window.location.href = headerAdv[0].pageUrl;
            }
          }}
        />
      </div>
      <div className="block-c b-w box-s">
        <div className="sel-date">
          <dl>
            <dt>请选择节目播出月份：</dt>
            <dd>
              <label>
                {yearList && yearList.length > 0 ? (
                  <select
                    defaultValue={new Date(currentDate)
                      .getFullYear()
                      .toString()}
                    onChange={(e: any) => {
                      const date = new Date(selectedDate);
                      date.setFullYear(Number(e.target.value));
                      date.setMonth(0);
                      onDateChange(date.getTime());
                    }}
                  >
                    {yearList?.map((item: number) => {
                      return (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                ) : null}
              </label>
              <span>
                {monthList
                  .filter((_, index) => {
                    const selected = new Date(selectedDate);
                    const selectedYear = selected.getFullYear();
                    const selectedMonth = selected.getMonth() + 1;
                    const current = new Date(currentDate);
                    const currentYear = current.getFullYear();
                    const currentMonth = current.getMonth() + 1;

                    if (
                      selectedYear === currentYear &&
                      index + 1 > currentMonth
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  })
                  .map((item, idx) => {
                    return (
                      <a
                        className={`cursor-pointer ${
                          new Date(selectedDate)?.getMonth() === idx
                            ? "seled"
                            : ""
                        }`}
                        key={idx}
                        onClick={() => {
                          onDateChange(new Date(selectedDate).setMonth(idx));
                        }}
                      >
                        {item}
                      </a>
                    );
                  })}
              </span>
            </dd>
          </dl>
        </div>
        <table className="basic-table adieo-x" style={{ width: "1200px" }}>
          <tbody>
            <tr>
              <th
                style={{
                  backgroundColor: "#f9f9f9",
                  fontSize: "16px",
                  fontWeight: "normal",
                }}
              >
                播放
                <br />
                时间
              </th>
              {columns?.map((column: any, idx: number) => {
                const { itemDesc, itemImage, itemName } = column;
                return (
                  <td key={idx}>
                    <div className="jm-tn">
                      <img src={itemImage} />
                      {itemName}
                      <br />
                      {itemDesc}
                    </div>
                  </td>
                );
              })}
            </tr>
            {dataSource
              ?.map((item: string[][], idx: number) => {
                return (
                  <tr key={idx}>
                    {item.map((subItem: string[], index: number) => {
                      if (index === 0) {
                        return <th key={index}>{subItem}</th>;
                      } else {
                        return (
                          <td style={{ textAlign: "center" }} key={index}>
                            {subItem && subItem.length > 0 ? (
                              currentAudio.src === subItem[0] ? (
                                playing ? (
                                  <img
                                    className="cursor-pointer"
                                    src={
                                      require("../../assets/images/icon-08.png")
                                        .default
                                    }
                                    onClick={() => {
                                      onAudioPlayClick();
                                    }}
                                  />
                                ) : (
                                  <img
                                    className="cursor-pointer"
                                    src={
                                      require("../../assets/images/icon-07.png")
                                        .default
                                    }
                                    onClick={() => {
                                      const { itemName, itemImage } = columns[
                                        index - 1
                                      ];
                                      onPlayClick({
                                        cover: itemImage,
                                        src: subItem[0],
                                        title: itemName,
                                      });
                                    }}
                                  />
                                )
                              ) : (
                                <img
                                  className="cursor-pointer"
                                  src={
                                    require("../../assets/images/icon-07.png")
                                      .default
                                  }
                                  onClick={() => {
                                    const { itemName, itemImage } = columns[
                                      index - 1
                                    ];
                                    onPlayClick({
                                      cover: itemImage,
                                      src: subItem[0],
                                      title: itemName,
                                    });
                                  }}
                                />
                              )
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })
              .filter((_: any, idx: number) => {
                if (!isMore) {
                  return idx < 10;
                } else {
                  return true;
                }
              })}
          </tbody>
        </table>
        {!isMore ? (
          <div className="show-d">
            <a className="show-bat cursor-pointer" onClick={showMore}>
              显示完整内容&nbsp;
              <img src={require("../../assets/images/icon-jt04.png").default} />
            </a>
          </div>
        ) : null}
      </div>

      <div className="foot-gg box-s">
        <img
          className="cursor-pointer"
          src={footerAdv && footerAdv.length > 0 ? footerAdv[0].imageUrl : ""}
          alt="adv"
          onClick={() => {
            if (footerAdv[0].pageUrl) {
              window.location.href = footerAdv[0].pageUrl;
            }
          }}
        />
      </div>
    </div>
  );
};

export default Playback;
