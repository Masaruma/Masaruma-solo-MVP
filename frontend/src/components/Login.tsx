import { Dispatch, SetStateAction } from "react";

import { Link } from "react-router-dom";

interface LoginProps {
  setSuccess: Dispatch<SetStateAction<boolean>>;
}

export const Login = ({ setSuccess }: LoginProps) => {
  return (
    <div className={"loginDiv"}>
      <form className={"form"} onSubmit={() => setSuccess(true)}>
        <div className={"inputDiv"}>
          <label htmlFor={"username"}>ユーザーID </label>
          <input className={"textbox"} name={"username"} type={"text"} />
        </div>
        <div className={"inputDiv"}>
          <label htmlFor={"password"}>パスワード </label>
          <input className={"textbox"} name={"password"} type={"password"} />
        </div>
        <div>
          <Link to={"/test"}>test</Link>
          <button value={"ログイン"}>ログイン</button>
        </div>
      </form>
    </div>
  );
};
