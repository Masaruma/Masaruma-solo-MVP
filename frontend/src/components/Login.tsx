import React from "react";

const Login = ({ setSuccess }) => {
    return (
        <div className="loginDiv">
            <form
                className="form"
                onSubmit={async (e) => {
                    // e.preventDefault();
                    // console.log("e: ", e.target);
                    // const username = e.target.username.value;
                    // console.log("username: ", username);
                    // const password = e.target.password.value;
                    // console.log("password: ", password);
                    // const formData = new FormData(e.target);
                    // // console.log("formData: ", formData);
                    // // const data = Object.fromEntries(formData.entries());
                    // // console.log(data);
                    // const response = await fetch("/login", {
                    //     method: "POST",
                    //     body: formData,
                    // });

                    // if (response.ok) {
                    //     // ログイン成功時の処理
                    //     setSuccess(true);
                    // }
                    setSuccess(true);
                }}
            >
                {/* <form className="form" action="/login" method="post"> */}
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
