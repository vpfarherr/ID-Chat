/*
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import {Container, Description, Formulario, ImageCustom, Layout, Title} from "./style";
import {X} from "react-feather";
import api, {socket} from "../../services/api";
import ModalMenu from "../../components/MenuModal";
import ErrorModal from "../../components/ErrorModal";
import BackdropComponent from "../../components/BackdropComponent";
import {useLocation} from "react-router-dom";
import {login} from "../../services/auth";
import LoginImage from "../../assets/login-logo.png";
import dotenv from 'dotenv';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: 0,
        outline: 0,
        boxShadow: theme.shadows[5],
        padding: 0,
        width: "100%",
        height: "100%"
    },
}));

import axios from 'axios';

export default function LoginPage({history}) {
    const classes = useStyles();
    const [open,] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openMenuModal, setOpenMenuModal] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [titleError, setTitleError] = useState("");
    const animationRef = useRef(null);
    const layoutRef = useRef(null);

    const {state: haveLogin} = useLocation();

    useEffect(() => {
        socket.on("qrCode", (qrCode) => {
            if (email === qrCode.session) {
                setQrCode(qrCode.data);
                handleCloseBackdrop();
                if (animationRef.current !== null) {
                    animationRef.current.classList.remove("animation");
                }
            }
        });

        socket.off("session-logged").on("session-logged", (status) => {
            if (status.session === email) {
                if (password) {
                    insertLocalStorage();

                    setTimeout(() => {
                        history.push("/chat");
                    }, 500)
                }
            }
        });
    }, [email, password]);

    async function submitSession(e) {
        e.preventDefault();

        if (email === "" || password === "") {
            handleOpenErrorModal();
            setTitleError("Llena todos los campos");
            setErrorMessage("Necesitas llenar todos los campos antes de continuar.");
        } else {
            handleToggleBackdrop();
            await authenticateUser();
        }
    }

    function insertLocalStorage() {
        login(JSON.stringify({email: email, password: password}));
    }

    async function authenticateUser() {
        try {
            const response = await axios.post(`${process.env.SUPPORT_APP_API_URL}chat/authenticate`, {
                email: email,
                password: password
            });

            if (response.data) {
                insertLocalStorage();
                history.push("/chat");
            } else {
                throw new Error("Authentication failed");
            }
        } catch (e) {
            setTimeout(function () {
                handleCloseBackdrop();
                handleOpenErrorModal();
                setTitleError("Oops... Algo salió mal.");
                setErrorMessage("Verifica si el email y la contraseña son correctos.");
            }, 2000);
        }
    }

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    const handleToggleBackdrop = () => {
        setOpenBackdrop(!openBackdrop);
    };

    const handleCloseModal = () => {
        setOpenMenuModal(false);
    };

    const handleOpenModal = () => {
        setOpenMenuModal(true);
    };

    const handleCloseErrorModal = () => {
        setOpenErrorModal(false);
    };

    const handleOpenErrorModal = () => {
        setOpenErrorModal(true);
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Layout className={classes.paper}>
                        <ModalMenu handleClose={handleCloseModal} open={openMenuModal}/>
                        <ErrorModal handleClose={handleCloseErrorModal} open={openErrorModal}
                                    errorMessage={errorMessage}
                                    titleError={titleError}/>
                        <BackdropComponent open={openBackdrop}/>

                        {
                            haveLogin !== undefined ?
                                <div className={"close-item"} onClick={() => history.goBack()}>
                                    <X/>
                                </div>
                                : null
                        }

                        <Container>
                            <div className={"container-session"}>
                                <div id={"left-div"}>
                                    <img src={LoginImage} alt={"Login Team"}/>
                                </div>

                                <div id={"right-div"}>
                                    {
                                        qrCode === "" ? null : (
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <ImageCustom
                                                    ref={animationRef}
                                                    className={"animation noselect"}
                                                    autoplay
                                                    src={qrCode}
                                                    alt={"Smartphone"}
                                                    draggable={"false"}
                                                />
                                                <Title>
                                                    Escanea el código QR
                                                </Title>
                                            </div>
                                        )
                                    }

                                    {
                                        qrCode !== "" ? null : (
                                            <Formulario onSubmit={(e) => submitSession(e)}>
                                                <Title id={"title"}>
                                                    Inicia sesión
                                                </Title>

                                                <Description id={"description"}>
                                                    Ingresa el email y la contraseña para acceder a tu cuenta
                                                </Description>

                                                <div className={"top-info"}>
                                                    <small>
                                                        Email
                                                    </small>
                                                </div>
                                                <input
                                                    id={"email"}
                                                    autoComplete="off"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />

                                                <div className={"top-info"}>
                                                    <small>
                                                        Contraseña
                                                    </small>
                                                </div>

                                                <input
                                                    id={"password"}
                                                    autoComplete="off"
                                                    placeholder="Contraseña"
                                                    value={password}
                                                    onChange={(e) =>{setPassword(e.target.value)}}
                                                />

                                                <button type="submit" id="send-btn">
                                                    Enviar
                                                </button>
                                            </Formulario>
                                        )
                                    }
                                </div>
                            </div>

                        </Container>
                    </Layout>
                </Fade>
            </Modal>
        </div>
    );
}