import React, { useMemo } from "react";

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onPageChange: (current: number) => void;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const { current, pageSize, total, onPageChange } = props;

  const totalPages = useMemo<number>(() => {
    return Math.ceil(total / pageSize);
  }, [pageSize, total]);

  const optionsRender = () => {
    const options = [];
    for (let i = 0; i < totalPages; i++) {
      options.push(
        <option key={i} value={i + 1}>
          {i + 1}
        </option>
      );
    }
    return options;
  };

  const pagesRender = () => {
    const pages: any = [];
    if (totalPages < 8) {
      // 页数小于 8 页不显示省略
      for (let i = 1; i < totalPages + 1; i++) {
        pages.push(
          <li key={i}>
            <a
              className={current === i ? "sel" : ""}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
            >
              {i}
            </a>
          </li>
        );
      }
      return pages;
    } else {
      if (current > 4) {
        pages.push(
          <li key={1}>
            <a
              onClick={(e) => {
                e.preventDefault();
                onPageChange(1);
              }}
            >
              1
            </a>
          </li>
        );
        pages.push(
          <li key="left">
            <a
              className="pagination-ellipsis pagination-double-left"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(current - 5 < 1 ? 1 : current - 5);
              }}
            ></a>
          </li>
        );
      } else if (current === 4) {
        for (let i = 1; i < 6; i++) {
          pages.push(
            <li key={i}>
              <a
                className={current === i ? "sel" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i);
                }}
              >
                {i}
              </a>
            </li>
          );
        }
      } else {
        for (let i = 1; i < 5; i++) {
          pages.push(
            <li key={i}>
              <a
                className={current === i ? "sel" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i);
                }}
              >
                {i}
              </a>
            </li>
          );
        }
      }
      if (current > 4 && totalPages - current > 3) {
        pages.push(
          <li key={current - 1}>
            <a
              onClick={(e) => {
                e.preventDefault();
                onPageChange(current - 1);
              }}
            >
              {current - 1}
            </a>
          </li>
        );
        pages.push(
          <li key={current}>
            <a
              className="sel"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(current);
              }}
            >
              {current}
            </a>
          </li>
        );
        pages.push(
          <li key={current + 1}>
            <a
              onClick={(e) => {
                e.preventDefault();
                onPageChange(current + 1);
              }}
            >
              {current + 1}
            </a>
          </li>
        );
      }
      if (totalPages - current > 3) {
        pages.push(
          <li key="right">
            <a
              className="pagination-ellipsis pagination-double-right"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(
                  current + 5 > totalPages ? totalPages : current + 5
                );
              }}
            ></a>
          </li>
        );
        pages.push(
          <li key={totalPages}>
            <a
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
            >
              {totalPages}
            </a>
          </li>
        );
      } else if (totalPages - current === 3) {
        for (let i = totalPages - 4; i < totalPages + 1; i++) {
          pages.push(
            <li key={i}>
              <a
                className={current === i ? "sel" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i);
                }}
              >
                {i}
              </a>
            </li>
          );
        }
      } else {
        for (let i = totalPages - 3; i < totalPages + 1; i++) {
          pages.push(
            <li key={i}>
              <a
                className={current === i ? "sel" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i);
                }}
              >
                {i}
              </a>
            </li>
          );
        }
      }
    }

    return pages;
  };

  return (
    <table className="pagination basic-table p-2">
      <tbody>
        <tr>
          <td>
            <a
              onClick={(e) => {
                e.preventDefault();
                if (current === 1) {
                  return;
                }
                onPageChange(1);
              }}
            >
              &nbsp;&nbsp;首&nbsp;页&nbsp;&nbsp;
            </a>
          </td>
          <td>
            <a
              className={current === 1 ? "pagination-disable-button" : ""}
              onClick={(e) => {
                e.preventDefault();
                if (current === 1) {
                  return;
                }
                onPageChange(current - 1);
              }}
            >
              &nbsp;&nbsp;上一页&nbsp;&nbsp;
            </a>
          </td>
          <td>
            <ul>{pagesRender()}</ul>
          </td>
          <td>
            <a
              className={
                current === totalPages ? "pagination-disable-button" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                if (current === totalPages) {
                  return;
                }
                onPageChange(current + 1);
              }}
            >
              &nbsp;&nbsp;下一页&nbsp;&nbsp;
            </a>
          </td>
          <td>
            <a
              onClick={(e) => {
                e.preventDefault();
                if (current === totalPages) {
                  return;
                }
                onPageChange(totalPages);
              }}
            >
              &nbsp;&nbsp;末&nbsp;页&nbsp;&nbsp;
            </a>
          </td>
          <td>
            <select
              name="sldd"
              defaultValue="1"
              onChange={(e) => {
                onPageChange(Number(e.target.value));
              }}
            >
              {optionsRender()}
            </select>
          </td>
          <td>
            <div>
              共 <strong>{totalPages}</strong> 页 <strong>{total}</strong> 条
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Pagination;
