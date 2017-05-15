#### 1、子集合
    （1）添加引用
        using ProjectStandard.Model;
        （2）替换方法
          /// <summary>
                /// 获取应急演练信息
                /// </summary>
                /// <param name="tokenValue"></param>
                /// <returns></returns>
                public string GetDrill_Infos(string tokenValue)
                {
                    BaseBLL baseBLL = new BaseBLL();
                    string condition = @"select [Complete_Situation],[Drill_Content],[Drill_ID],[Drill_Time],[Drill_Title],[Participant],[Problems],[Remark],'' as FileUrl ,'' as FileName from Drill_Infos";
                    DataTable dt = baseBLL.GetDataTable(condition);
                    string Message = baseBLL.SelectObjects(tokenValue, "Drill_Infos", condition);
                    string json = "";
                    if (dt == null || dt.Rows.Count == 0)
                    {
                        Message = "查询结果不存在！";
                        json = Common.Common.FailMessage(Message);
                    }
                    else
                    {
                        List<Drill_InfoModel> Drill_Infos = new List<Drill_InfoModel>();
                        foreach (DataRow item in dt.Rows)
                        {
                            Drill_InfoModel DrillInfoModel = new Drill_InfoModel();
                            DrillInfoModel.Complete_Situation = item["Complete_Situation"].ToString();
                            DrillInfoModel.Drill_Content = item["Drill_Content"].ToString();
                            DrillInfoModel.Drill_ID = item["Drill_ID"].ToString();
                            DrillInfoModel.Complete_Situation = item["Drill_ID"].ToString();
                            DrillInfoModel.Drill_Time = item["Drill_Time"].ToString();
                            DrillInfoModel.Drill_Title = item["Drill_Title"].ToString();
                            DrillInfoModel.Participant = item["Participant"].ToString();
                            DrillInfoModel.Problems = item["Problems"].ToString();
                            DrillInfoModel.Remark = item["Remark"].ToString();
                            DrillInfoModel.FileUrl = GetDrill_InfosUrl(item["Drill_ID"].ToString());
                            DrillInfoModel.FileName = GetDrill_InfosFileName(item["Drill_ID"].ToString());
                            Drill_Infos.Add(DrillInfoModel);
         
                        }
                        json = "{\"success\":\"true\",\"message\":" + JsonConvert.SerializeObject(Drill_Infos) + "}";
                    }
                    return json;
                }
     
     
     
    /// <summary>
            /// 根据Drill_ID获取对应的应急演练附件URL
            /// </summary>
            /// <param name="Drill_ID"></param>
            /// <returns></returns>
            public List<string> GetDrill_InfosUrl(string Drill_ID)
            {
                string condition = @"select [File_URL] +'.'+ [file_type] as url from File_Infos
                where [Category_Code]='2BFDC8AC-6FFF-4C35-9D09-0EF74FC3593F'
                and Object_ID ='" + Drill_ID + "'";
                BaseBLL baseBLL = new BaseBLL();
                DataTable dt = baseBLL.GetDataTable(condition);
                List<string> urlList = new List<string>();
                foreach (DataRow item in dt.Rows)
                {
                    string url = item["url"].ToString();
                    urlList.Add(url);
                }
                return urlList;
            }
     
            /// <summary>
            /// 根据Drill_ID获取对应的应急演练附件名称
            /// </summary>
            /// <param name="Drill_ID"></param>
            /// <returns></returns>
            public List<string> GetDrill_InfosFileName(string Drill_ID)
            {
                string condition = @"select [File_Title] as FileName from File_Infos
                where [Category_Code]='2BFDC8AC-6FFF-4C35-9D09-0EF74FC3593F'
                and Object_ID ='" + Drill_ID + "'";
                BaseBLL baseBLL = new BaseBLL();
                DataTable dt = baseBLL.GetDataTable(condition);
                List<string> FileNameList = new List<string>();
                foreach (DataRow item in dt.Rows)
                {
                    string url = item["FileName"].ToString();
                    FileNameList.Add(url);
                }
                return FileNameList;
            }
#### 2、JSON
    //新增发送内容
    string sql = "INSERT INTO MessageInfo_R  (Msgcontent) VALUES ('" + Msgcontent + "');SELECT @@IDENTITY";
    string result = AddObjectsNew(tokenValue, "MessageInfo_R", sql);
    //新增发送人员
    JObject jo = JObject.Parse(result);
    string[] values = jo.Properties().Select(item => item.Value.ToString()).ToArray();
    
     jo = JObject.Parse(Send_Info);
     string[] users = jo.Properties().Select(item => item.Name.ToString() + ":" + item.Value.ToString()).ToArray();
    
    if (values[0] == "true")
    {
    
        try {
            for (var i = 0; i < users.Length; i++)
            {
                if (users[i] != "")
                {
                    string condition = "INSERT INTO MessageSend_R ( MsgID,ReceptNM,Mobile)  VALUES  ( " + values[1] + ",'" + users[i].Split(':')[0] + "','" + users[i].Split(':')[1] + "' )";
                     baseBLL.AddObjects(tokenValue, "MessageSend_R", condition);
                }
    
            }
            return Common.Common.SuccessNoMessage();
        }
        catch (Exception e)
        {
            return Common.Common.FailMessage(e.Message);
        }
 