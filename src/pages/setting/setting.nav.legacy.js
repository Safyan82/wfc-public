
                                            {/* employee */}
                                            <Collapse.Panel key="m-2" header={<div className='setting-sidebar-nav' style={{fontWeight:500}}>Employee</div>}>
                                                <ul className='setting-sidebar-nav-list'>
                                                    {/* <Link to={"#"} onClick={(e)=>e.preventDefault()}><li className={inactive}>Tab Customisation</li></Link> */}
                                                    <Link to={routes.propertySetting+"?field=employee"}><li className={path==routes.propertySetting+"?field=employee"?active:inactive}>Manage Fields & Groups</li></Link>
                                                    <Link to={routes.employeeEditForm}><li className={path==routes?.employeeEditForm?active:inactive}>Employee Setup Form</li></Link>
                                                </ul>
                                            </Collapse.Panel>

                                            {/* site */}
                                            <Collapse.Panel key="m-3" header={<div className='setting-sidebar-nav' style={{fontWeight:500}}>Site</div>}>
                                                <ul className='setting-sidebar-nav-list'>
                                                    {/* <Link to={"#"} onClick={(e)=>e.preventDefault()}><li className={inactive}>Tab Customisation</li></Link> */}
                                                    <Link to={routes.propertySetting+"?field=site"}><li className={path==routes.propertySetting+"?field=site"?active:inactive}>Edit Fields</li></Link>
                                                    <Link to={"#"} onClick={(e)=>e.preventDefault()}><li className={inactive}>Edit Form</li></Link>
                                                </ul>
                                            </Collapse.Panel>

                                            {/* customer */}
                                            <Collapse.Panel key="m-4" header={<div className='setting-sidebar-nav' style={{fontWeight:500}}>Customer</div>}>
                                                <ul className='setting-sidebar-nav-list'>
                                                    {/* <Link to={"#"} onClick={(e)=>e.preventDefault()}><li className={inactive}>Tab Customisation</li></Link> */}
                                                    <Link to={routes.propertySetting+"?field=customer"}><li className={path==routes.propertySetting+"?field=customer"?active:inactive}>Edit Fields</li></Link>
                                                    <Link to={"#"}  onClick={(e)=>e.preventDefault()}><li className={inactive}>Edit Form</li></Link>
                                                </ul>
                                            </Collapse.Panel>

                                            {/* Skill */}
                                            <Collapse.Panel key="m-5" header={<div className='setting-sidebar-nav' style={{fontWeight:500}}>Data Management</div>}>
                                                <ul className='setting-sidebar-nav-list'>

                                                    {/* <Link to={routes.editskill}><li className={path==routes?.editskill?active:inactive}>Edit Skills</li></Link> */}
                                                    
                                                </ul>
                                            </Collapse.Panel>
