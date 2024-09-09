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
import React, {useEffect, useState} from "react";
import {Container, Layout, LeftContainer, RightContainer} from "./style";
import {HeaderComponent, TableContainer} from "../Contacts/style";
import api from "../../services/api";
import {getSession} from "../../services/auth";
import config from "../../util/sessionHeader";
import {DataGrid} from "@material-ui/data-grid";
import {FilePlus, ListOrdered, Sheet, UserPlus} from "lucide-react";
import ModalCreateGroup from "../../components/Group/CreateGroup";
import {useJsonToCsv} from 'react-json-csv';

const {saveAsCsv} = useJsonToCsv();

const GroupPage = () => {
    const [groups, setGroups] = useState([]);
    const [, setSelected] = useState(1);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    const handleOpenCreate = () => {
        setOpenModalCreate(true);
    };

    const handleCloseCreate = () => {
        setOpenModalCreate(false);
    };

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: "47.50%"
        },
        {
            field: "name",
            headerName: "Name",
            width: "47.50%"
        },
    ];

    const rows = groups.map((group, index) => {
        return {
            key: index,
            id: group.id._serialized,
            name: group.name,
        };
    });

    useEffect(() => {
        async function getAllGroups() {
            const {data: allGroups} = await api.get(`${getSession()}/all-groups`, config());
            setGroups(allGroups.response);
        }

        getAllGroups();

    }, []);

    return (
        <Layout>
            <ModalCreateGroup handleClose={handleCloseCreate} open={openModalCreate}/>
            <Container>
                <LeftContainer>
                    <ul>
                        <li onClick={() => setSelected(1)}>
                            <div className={"wrapper-li"}>
                                <div className={"wrapper-ic"}>
                                    <ListOrdered/>
                                </div>
                                <div className={"wrapper-text"}>
                                    <h2>
                                        Todos los grupos
                                    </h2>
                                    <p>
                                        Administrar todos tus grupos.
                                    </p>
                                </div>
                            </div>
                        </li>

                        <li onClick={() => {
                            setSelected(1);
                            handleOpenCreate();
                        }}>
                            <div className={"wrapper-li"}>
                                <div className={"wrapper-ic"}>
                                    <FilePlus/>
                                </div>
                                <div className={"wrapper-text"}>
                                    <h2>
                                        Crear grupo
                                    </h2>
                                    <p>
                                        Crear un grupo de WhatsApp de manera automatizada.
                                    </p>
                                </div>
                            </div>
                        </li>

                        <li onClick={() => setSelected(2)}>
                            <div className={"wrapper-li"}>
                                <div className={"wrapper-ic"}>
                                    <UserPlus/>
                                </div>
                                <div className={"wrapper-text"}>
                                    <h2>
                                        Invitar participantes
                                    </h2>
                                    <p>
                                        Invitar participantes a tus grupos.
                                    </p>
                                </div>
                            </div>
                        </li>

                        <li onClick={() => {
                            saveAsCsv({
                                data: rows,
                                fields: {"id": "ID", "name": "Name"},
                                filename: `group-${getSession()}`
                            });
                            setSelected(3);
                        }}>
                            <div className={"wrapper-li"}>
                                <div className={"wrapper-ic"}>
                                    <Sheet/>
                                </div>
                                <div className={"wrapper-text"}>
                                    <h2>
                                        Exportar Lista de Grupos
                                    </h2>
                                    <p>
                                        Exporta tu lista de grupos a Excel.
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </LeftContainer>

                <RightContainer>
                    <HeaderComponent>
                        <h2>
                            Grupos
                        </h2>

                        <div>
                            <input placeholder={"Buscar grupo..."}/>
                        </div>
                    </HeaderComponent>

                    <TableContainer>
                        <DataGrid
                            color="primary"
                            variant="outlined"
                            shape="rounded"
                            pageSize={15}
                            columns={columns}
                            rows={rows}
                        />
                    </TableContainer>
                </RightContainer>
            </Container>
        </Layout>
    );
};

export default GroupPage;
