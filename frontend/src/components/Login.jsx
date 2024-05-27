import React from "react";

const Login = ({ setSuccess }) => {
    return (
        <div className="loginDiv">
            <form className="form" onSubmit={() => setSuccess(true)}>
                <div className="inputDiv">
                    <label>ユーザーID </label>
                    <input className="textbox" type="text" name="username" />
                </div>
                <div className="inputDiv">
                    <label>パスワード </label>
                    <input
                        className="textbox"
                        type="password"
                        name="password"
                    />
                </div>
                <div>
                    <input type="submit" value="ログイン" />
                </div>
            </form>
        </div>
    );
};

export default Login;
