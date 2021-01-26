import React, { useState, useEffect, useCallback } from "react";

interface BannerProps {
  bannerList: any[];
}

const Banner: React.FC<BannerProps> = (props) => {
  const { bannerList } = props;
  const [current, setCurrent] = useState<number>(0);
  const [timer, setTimer] = useState<number>();

  const startTimer = () => {
    setTimer((timer) => {
      if (timer) {
        window.clearTimeout(timer);
      }

      const len = bannerList.length;

      return window.setTimeout(() => {
        setCurrent((current) => {
          if (current === len - 1) {
            return 0;
          } else {
            return current + 1;
          }
        });

        startTimer();
      }, 5000);
    });
  };

  const handleRedDotHover = (index: number) => {
    if (current !== index) {
      startTimer();
      setCurrent(index);
    }
  };

  const handleImageClick = (index: number) => {
    console.log(bannerList[index]);
    const { pageUrl } = bannerList[index];
    const url = pageUrl;
    if (url) {
      window.location.href = url;
    }
  };

  useEffect(() => {
    const len = bannerList.length;

    if (len > 1) {
      startTimer();
    } else {
      if (timer) {
        window.clearTimeout(timer);
      }
    }
  }, [bannerList]);

  useEffect(() => {
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <div className="banner-list">
      {bannerList.map((item, index) => {
        return (
          <div
            className={["banner-item", current === index ? "active" : ""].join(
              " "
            )}
            key={item.id}
          >
            <img
              className="banner-image cursor-pointer"
              src={item.imageUrl}
              alt="banner"
              onClick={() => {
                handleImageClick(index);
              }}
            />
          </div>
        );
      })}
      <div className="red-dot-wrapper">
        {bannerList.map((item, index) => {
          return (
            <div
              className={["red-dot", current === index ? "active" : ""].join(
                " "
              )}
              key={index}
              onMouseEnter={() => {
                handleRedDotHover(index);
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Banner;
