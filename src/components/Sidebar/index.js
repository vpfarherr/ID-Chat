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
import React, {useState} from "react";
import {BottomItems, ChangeSession, Container, InfoSession, Layout, LogoutButton, MenuItems} from "./style";
import {NavLink} from "react-router-dom";
import {BarChart, LogOut, MessageCircle, Settings, User, Users} from "react-feather";
import ChangeSessionDialog from "../ChangeSession";
import {getSession, getToken} from "../../services/auth";
import api from "../../services/api";

const Sidebar = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedValue, setSelectedValue] = useState(getSession());

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = (value) => {
        setOpenDialog(false);
        setSelectedValue(value);
    };

    const handleClickDisabled = (e) => {
        e.preventDefault();
    };

    async function logoutSession(e) {
        e.preventDefault();

        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
        await api.post(`${getSession()}/logout-session`, null, config);
        window.location.href = "/";
    }

    async function closeSession() {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
        await api.post(`${getSession()}/close-session`, null, config);
        window.location.href = "/new-session";
    }

    return (
        <Layout>
            {openDialog && <ChangeSessionDialog
                handleClose={handleClose}
                open={openDialog}
                selectedValue={selectedValue}
            />}

            <Container>
                <MenuItems>
                    <li>
                        <NavLink to={"chat"} activeClassName={"selected"}>
                            <MessageCircle/> Chat
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to={"contacts"} activeClassName={"selected"}>
                            <User/> Contactos
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to={"group"} activeClassName={"selected"}>
                            <Users/> Grupos
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to={"resports"}
                            activeClassName={"selected"}
                            onClick={(e) => handleClickDisabled(e)}
                            className={"disabled"}
                        >
                            <BarChart/> Reportes
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to={"settings"}
                            activeClassName={"selected"}
                            onClick={(e) => handleClickDisabled(e)}
                            className={"disabled"}>
                            <Settings/> Configuración
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to={"logout"}
                            activeClassName={"selected"}
                            onClick={(e) => logoutSession(e)}
                        >
                            <LogOut/> Log out
                        </NavLink>
                    </li>
                </MenuItems>

                <BottomItems>
                    <ChangeSession>
                        <div>
                            <div className={"online-circle"}/>
                            <p>
                                En linea
                            </p>
                        </div>

                        <div>
                            <a href={"/change-session"} onClick={(e) => {
                                e.preventDefault();
                                handleClickOpen();
                            }}>
                                Cambiar sesión
                            </a>
                        </div>
                    </ChangeSession>

                    <InfoSession>
                        <img src={`https://ui-avatars.com/api/?name=${getSession()}?background=random`}
                             alt={selectedValue}/>
                        <div>
                            <p>
                                {selectedValue}
                            </p>
                            <small>
                                Sección actual
                            </small>
                        </div>
                    </InfoSession>

                    <LogoutButton onClick={() => closeSession()}>
                        Logout
                    </LogoutButton>
                </BottomItems>
            </Container>
        </Layout>
    );
};

export default Sidebar;
