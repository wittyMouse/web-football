import React from "react";
import { useHistory } from "react-router-dom";

interface UserListProps {
  title: string;
  headerClass: string;
  userList: any;
}

const UserList: React.FC<UserListProps> = (props) => {
  const { title, headerClass, userList } = props;
  const history = useHistory();
  return (
    <div className="b-w box-s pading-1 m-b24">
      <h1 className={`title-bg02 ${headerClass}`}>{title}</h1>
      <div className="clearfix b-list">
        {userList?.map((item: any) => {
          const {
            avatar,
            description,
            id,
            realname,
            result,
            resultMap,
            num,
          } = item;

          return (
            <dl
              className="box-s cursor-pointer"
              key={id}
              onClick={() => {
                history.push(`/latest-clue/profile/${id}`);
              }}
            >
              <div className="gxshul">{num}</div>
              <dd>
                <a>
                  <img src={avatar} />
                </a>
              </dd>
              <dt>
                <h1>
                  <a>{realname}</a>
                </h1>
                <p className="text-multi-ellipsis--l2">{description}</p>
              </dt>
            </dl>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
