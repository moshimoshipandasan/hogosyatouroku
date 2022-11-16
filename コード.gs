/** @OnlyCurrentDoc */
'use strict'

function hogosyaEmails(e) {
  FormApp.getActiveForm();
  let value =[];
  let itemResponses = e.response.getItemResponses();
  //回答者のメールアドレスを取得する
  let recipient = e.response.getRespondentEmail();

  //for文(ループ)で変数itemResponsesから個々の質問と回答を取得する
  for(let i = 0; i < itemResponses.length; i++) {
  //回答を取得する
    value[i] = itemResponses[i].getResponse();
  }
  
  invitedClassroom(recipient, value[1]);
}

/***
 * Google Classroom の生徒アカウントに対して、保護者のメールアドレスを招待する
 */
function invitedClassroom(studentEmail, invitedEmail) {
  let status = '';                                  // この関数の処理結果

  let optionArgs = {
    "invitedEmailAddress": invitedEmail,            // 保護者のメールアドレス
  };

  try {
    let res;
    // 招待する前に同じ内容で招待されていないかを確認する。
    // 既に招待されていれば、ALREADY_EXISTS を戻す。

    // 保護者の状態を取得
    //    https://developers.google.com/classroom/reference/rest/v1/userProfiles.guardianInvitations/list
    res = Classroom.UserProfiles.GuardianInvitations.list(studentEmail, optionArgs);
    if (res.guardianInvitations) {
//      console.log('既に登録されている : ' + studentEmail + ' ( ' + invitedEmail + ' )');
      status = 'ALREADY_EXISTS';
    }
    else {
      // 保護者の招待
      //    https://developers.google.com/classroom/reference/rest/v1/userProfiles.guardianInvitations/create
      res = Classroom.UserProfiles.GuardianInvitations.create(optionArgs, studentEmail);
//      console.log('新規登録 : ' + studentEmail + ' ( ' + invitedEmail + ' )');
      status = res.state;                           // API から戻された状態を戻す
    }
  }
  catch (e) {
    console.log(e);
    status = e.message;                             // 想定しない状況が発生した場合には、その内容を戻す
  }

  return status;
}
