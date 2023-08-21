<template>
  <div>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <div style="background-color:lightgray; max-height: 80px;" class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 border-bottom box-shadow">
      <h5 class="my-0 mr-md-auto font-weight-normal"><img style="height: 50px;" src="/build/images/logoumms.95173268.svg" alt="University of Maryland Medical System logo"></h5>
      <nav class="my-2 my-md-0 mr-md-3">
        <h5 class="my-0 mr-md-auto font-weight-normal d-none d-sm-none d-md-block"></h5>
      </nav>
    </div>
    <div v-if="epic.csn != '0'" id="top_panel" class="container m-auto" style="width: 100%; margin-left: 0px !important; margin-right: 0px !important; max-width: 100%;">
      <div class="content">
        <div class="container-fluid">
          <div class="row">
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card" style="margin-top: 0px; margin-bottom: 5px;">
                <div class="card-body">
                  <div style="display: inline-flex;">
                    <h5 style="padding-top: 11px;">Send As:</h5>
                    <button v-if="epic.tiger_active == false" style="max-height: 35px; margin-left:15px; margin-right: 5px;" type="button" class="btn btn-sm btn-danger">{{ epic.current_user.name }}</button>
                    <button v-if="epic.tiger_active == true" style="max-height: 35px; margin-left:15px; margin-right: 5px;" type="button" class="btn btn-sm" :class="{ 'btn-info': sender == epic.current_user.tigerID, 'btn-outline-info': sender != epic.current_user.tigerID }" @click="selectSender(epic.current_user.tigerID, epic.current_user.name)">{{ epic.current_user.name }}</button>
                    <button style="max-height: 35px; margin-right: 5px;" v-for="(role_obj,key) in epic.current_roles" type="button" class="btn btn-sm" :class="{ 'btn-info': sender == role_obj.entity.token, 'btn-outline-info': sender != role_obj.entity.token }" @click="selectSender(role_obj.entity.token, role_obj.entity.display_name)">{{role_obj.entity.display_name}}</button>
                    <p v-if="epic.tiger_active == false" style="line-height: normal; max-height: 35px;margin-left: 15px;text-align: center;font-style: italic;">You do not have a Tiger Account.<br>Call helpdesk to activate your account to allow 2-way communication.<br>Responses to your message can only be sent to the Tiger App.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="card" style="margin-top: 5px; margin-bottom: 5px;">
                <div class="card-body">
                  <div style="display: inline-flex;">
                    <h5 style="padding-top: 11px;">Send To:</h5>
<!--                    <button style="max-height: 30px; margin-left:15px;" v-b-tooltip.hover title="Search for roles" type="button" class="btn btn-sm btn-outline-info" @click="openProviderSearch2()">Search Roles</button>
                    <button style="max-height: 30px; margin-left:5px;" v-b-tooltip.hover title="Search for users" class="btn btn-sm btn-outline-info" @click="openPopup()">Search Users</button> -->
                    <button style="max-height: 30px; margin-left:5px;" class="btn btn-sm btn-outline-info" @click="openCombinedPopup()"><icon name="search" class=""/> Search for Users/Roles</button>
                  </div>
                  <div style="margin-bottom: 10px; border: solid 1px #ced4da; padding: 3px; min-height: 39px; border-radius: .25rem;">
                    <button v-for="recipient in recipients" @click="removeRecipient(recipient.token)" style="max-height: 35px; margin-right:3px;" type="button" class="btn btn-sm btn-info">
                      {{ recipient.name }} <span class="badge badge-light">x</span>
                    </button>
                  </div>
                  <h6>Suggested recipients:</h6>
                  <div style="display: inline-flex; margin-left: 5px;" v-for="(obj, team) in epic.treatment_team" v-bind:id="team">
                    <button v-for="(team_obj,key) in epic.treatment_team[team]" type="button" class="btn btn-sm" :class="{ 'btn-info': isInRecipients(team_obj.token), 'btn-outline-info': !isInRecipients(team_obj.token)}" @click="selectUser(team_obj.token, team_obj.name, true)"><b>{{team}}<button v-if="team_obj.dnd == true" type="button" class="btn btn-danger" style="padding: 3px; font-size: 10px;margin: 0px; margin-left: 2px; cursor: auto;">DND</button></b><br/>{{team_obj.name}}<span v-if="team_obj.role_user != ''"><br/>{{team_obj.role_user}}</span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="card" style="margin-top: 5px; margin-bottom: 5px;">
                <div class="card-body">
                  <div style="display: inline-flex;">
                    <h5 style="padding-top: 11px; margin-right: 14px;">Message Body:</h5>
                    <v-select style="min-width:300px; padding-top: 5px;" placeholder="Search for a Smartphrase..." :change="checkValue()" v-model="smartphrase_choice" value="mnemonic" label="mnemonic" :options="epic.smart_phrases">
                      <template v-slot:option="option">
                        {{ option.description }}
                      </template>
                    </v-select>
                  </div><br/>
                  <button v-for="sb in epic.sb_smart_phrases" class="btn btn-sm" :class="{ 'btn-info': smartphrases_clicked.includes('SECUREMESSAGESB'+sb.mnemonic), 'btn-outline-info': !smartphrases_clicked.includes('SECUREMESSAGESB'+sb.mnemonic) }" @click="speedButton('SB'+sb.mnemonic, sb.id)">{{sb.description}}</button>
                  <!--<div data-v-1691b4de="" style="margin-top: 10px; border: 1px solid lightgray; border-radius: 5px;">
                  <textarea disabled="disabled" data-background-color="blue" class="form-control form-textarea" v-model="tiger_message_top" rows="5" aria-placeholder="Type message here...">
                  </textarea>
                </div> -->
                  <textarea-input :class="{ 'urgent-picked': priority==1, '': priority!=1 }" id="tiger_textarea" data-background-color="blue" style="margin-top: 10px; border: 1px solid lightgray; border-radius: 5px;" v-model="tiger_message" rows="10" aria-placeholder="Type message here...">

                  </textarea-input>
                  <div>
                    <h5 style="width:77px; padding-top: 11px; margin-right: 14px; margin-bottom: 0px; display: inline-flex;">Priority:</h5>
                    <input @change="togglePriority()" v-bind:checked="priority=='1'" name="priority" id="priority" type="checkbox"/> <label for="priority" style="margin-bottom: 0px; color: #333333; font-size: 0.875rem;" class="">Send as Urgent Message?</label>
                  </div>
                  <div>
                  <h5 style="padding-top: 11px; margin-right: 14px; margin-bottom: 0px; display: inline-flex;">Signature:</h5>
                  <input @change="toggleSignature()" v-bind:checked="show_signature" name="show_signature" id="show_signature" type="checkbox"/> <label for="show_signature" style="margin-bottom: 0px; color: #333333; font-size: 0.875rem;" class="">Add my signature</label><p v-if="epic.tiger_active==false" style="color: red; margin-top: 0px; margin-bottom:0px; margin-left: 8px;">*If you don't have Tiger, please add a callback number to your signature line</p>
                  </div>

                    <input v-if="show_signature==true" class="form-control form-text form-input" style="margin-top: 10px; border: 1px solid lightgray; border-radius: 5px;" type="text" v-model="signature"/>

                  <div>
                    <h5 style="padding-top: 11px; margin-right: 14px; margin-bottom: 0px; display: inline-flex;">Read Receipts:</h5>
                    <input @change="toggleReadReceipts()" v-bind:checked="read_receipts" :disabled="epic.tiger_active==false" name="read_receipts" id="read_receipts" type="checkbox"/> <label for="read_receipts" style="margin-bottom: 0px; color: #333333; font-size: 0.875rem;" class="">Receive Read Receipts (check who you want to receive receipts for)</label><p v-if="epic.tiger_active==false" style="color: red; margin-top: 0px; margin-bottom:0px; margin-left: 8px;">*You can't receive read receipts if you don't have a tiger account</p>
                  </div>
                  <div>
                    <div v-if="read_receipts">
                      <div class="" v-for="recipient in recipients" :key="recipient.token">
                        <input type="checkbox" v-bind:name="recipient.token" :disabled="recipient.type == 'tigertext:entity:team'" v-bind:value="recipient.token" class="mr-3" v-model="readReceiptPeople"/><label>{{recipient.name}} <spn v-if="recipient.type == 'tigertext:entity:team'" style="color: red; margin-top: 0px; margin-bottom:0px; margin-left: 8px;">(teams can't send receipts)</spn></label>
                    </div>
                    </div>
                  </div>

                  <button v-if="recipients.length > 0 && !sending_in_progress" id="send_btn" style="margin-top:15px;" class="btn btn-info" @click="sendMessage()" type="button"><icon name="send" class=""/>Send</button>
                  <button v-if="recipients.length == 0 || sending_in_progress" id="send_btn" style="margin-top:15px;" class="btn btn-default" type="button"><icon name="send" class=""/>Send</button>
                  <a style="color: white;" href="https://toc-envoytst01.umms.umm.edu/training"><button id="" style="float:right; margin-top:15px; background-color: #08978B; padding: 8px;" class="btn btn-info" type="button">Tipsheets</button></a>
                  <button style="float:right; margin-top:15px; background-color: #08978B; padding: 8px;" class="btn btn-info" @click="openSupportModal()" type="button"><icon name="support" class=""/>Feedback Form</button>

                  <div v-if="recipients.length == 0" style="margin-top: 15px; color: red;">
                    *At least one recipient is required to send!
                  </div>

                  <div style="margin-top: 15px;">
                    NOTE: If you are expecting a response to the message but don't receive one, use an alternative mode of communication as a back-up.
                  </div>
                    <div id="message_sent" class="alert alert-success d-none" style="margin-top: 15px;" role="alert">
                    Message sent!
                  </div>
                  <div id="feedback_message_sent" class="alert alert-success d-none" style="margin-top: 15px;" role="alert">
                    Feedback Message sent!
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <modal ref="combinedModal" style="margin: 0px auto; max-width: 1200px;">
        <template v-slot:header>
          <h3 class="font-bold">Search for a User/Role</h3>
          <h3 @click="closeCombinedPopup()" class="font-bond" style="float: right; cursor: pointer;">x</h3>
        </template>

      <template v-slot:body>
        <div style="min-height:400px; text-align: left;" class="border-r border-l">

          <div class="nav-wrapper position-relative end-0">
            <ul style="max-width: 500px;" class="nav nav-pills nav-fill p-1" role="tablist">
              <li style="border: 1px solid #2196f3; border-radius: 6px;" class="nav-item" role="presentation">
                <a class="nav-link mb-0 px-0 py-1" :class="{ 'active': users_tab == true, '': users_tab == false }" data-bs-toggle="tab" @click="toggleTabs('users')" role="tab" aria-selected="true">
                  <span class="">Users</span>
                </a>
              </li>
              <li style="border: 1px solid #2196f3; border-radius: 6px;" class="nav-item" role="presentation">
                <a class="nav-link mb-0 px-0 py-1" :class="{ 'active': roles_tab == true, '': roles_tab == false }" data-bs-toggle="tab" @click="toggleTabs('roles')" role="tab" aria-selected="false" tabindex="-1">
                  <span class="">Roles</span>
                </a>
              </li>
            </ul>
          </div>
          <input id="search_terms_combined" placeholder="Search" class="form-input bg-gray-400 rounded" style="min-width: 400px;" type="text" @input="checkBoth($event.target.value)" />
          <div id="roles_div" v-if="roles_tab == true">
            <p style="display: inline-flex;">If you'd like to filter based on tags, add some below.</p> <button class="btn btn-success" style="padding: 6px;" @click="searchAll()">Include all tags</button>
            <v-select @input="tagsValue()" v-model="current_tags" multiple="multiple" style=" max-width: 500px; min-width:300px; padding-top: 5px;" placeholder="Search for a tag..." value="token" label="name" :options="tags">
              <template v-slot:option="option">
                {{ option.name }}
              </template>
            </v-select>
            <input type="checkbox" v-bind:name="onlyOnDuty" v-bind:value="onlyOnDuty" v-model="onlyOnDuty" class="mr-3 mt-3 mb-3"/><label>Only show results with someone on-duty?</label>
            <table class="table min-w-full">
              <tr>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Role Name</td>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Person on Duty</td>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Action</td>
              </tr>
              <tr v-if="(!onlyOnDuty || ((role.type == 'tigertext:entity:account' && role.entity.metadata.owners.length > 0 && checkIfValidUser(role.entity.metadata.owners[0].username)) && role.entity.metadata.owners[0].username != '' || (role.type == 'tigertext:entity:team' && role.entity.members.length > 0)))" class="py-2 bg-white hover:bg-bggray border-b" v-for="role in roleResults">
                <td v-if="role.type == 'tigertext:entity:account'" class="py-2">{{role.entity.display_name}}<p v-if="role.entity.tags" style="color: gray; font-size: 12px; line-height: initial;">[{{role.entity.tags[0].name}}]</p></td>
                <td v-if="role.type == 'tigertext:entity:team'" class="py-2">{{role.entity.name}}<p v-if="role.entity.tags && role.entity.tags.length > 0" style="color: gray; font-size: 12px; line-height: initial;">[{{role.entity.tags[0].name}}]</p></td>

                <td class="py-2" v-if="role.type == 'tigertext:entity:account' && role.entity.metadata.owners.length > 0 && checkIfValidUser(role.entity.metadata.owners[0].username) && (role.entity.metadata.owners[0].username != '' || role.entity.metadata.owners[0].display_name != '')">{{getTigerName(role.entity.metadata.owners[0])}}</td> <td class="text-red-700" v-if="role.type == 'tigertext:entity:account' && (role.entity.metadata.owners.length == 0 || checkIfValidUser(role.entity.metadata.owners[0].username) == false || (role.entity.metadata.owners[0].username == '' && role.entity.metadata.owners[0].display_name == ''))">No one on duty</td>
                <td class="py-2" v-if="role.type == 'tigertext:entity:team' && role.entity.members.length > 0">Team Account (1+ member(s))</td> <td class="text-red-700" v-if="role.type == 'tigertext:entity:team' && (role.entity.members.length == 0)">No one on duty</td>

                <td v-if="role.type == 'tigertext:entity:account' && role.entity.metadata.owners.length > 0"><button type="button" class="btn btn-success" @click="selectRole(role.entity.token, role.entity.display_name, role)">Select</button></td> <td class="text-red-700" v-if="role.type == 'tigertext:entity:account' && role.entity.metadata.owners.length == 0"></td>
                <td v-if="role.type == 'tigertext:entity:team' && role.entity.members.length > 0"><button type="button" class="btn btn-success" @click="selectTeam(role.entity.token, role.entity.name)">Select</button></td> <td class="text-red-700" v-if="role.type == 'tigertext:entity:team' && role.entity.members.length == 0"></td>
              </tr>
              <tr v-if="continuation != null && continuation < total" class="py-2 bg-white hover:bg-bggray border-b">
                <td colspan="3"><button id="fetch_btn_roles" type="button" class="btn btn-info" @click="fetchMoreRoles(continuation)">Fetch More Results...</button><label id="fetch_text_roles" class="d-none">Fetching...</label></td>
              </tr>
            </table>
          </div>

          <div id="users_div" v-if="users_tab == true">
            <table class="table min-w-full">
              <tr>
                <td class="border-b-2 pb-2 pt-2 border-t-2">User Name</td>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Tiger Account</td>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Action</td>
              </tr>
              <tr v-if="((role.type == 'tigertext:entity:account' && checkIfValidUser(role.entity.username))) && role.entity.first_name != ''" class="py-2 bg-white hover:bg-bggray border-b" v-for="role in userResults">
                <td v-if="role.type == 'tigertext:entity:account'" class="py-2">{{role.entity.first_name}} {{role.entity.last_name}} <p v-if="epic['provider_lookup'][role.entity.username.toUpperCase()]" style="color: gray; font-size: 12px; line-height: initial;">[{{epic['provider_lookup'][role.entity.username.toUpperCase()]}}]</p></td>

                <td class="py-2" v-if="role.type == 'tigertext:entity:account'">{{role.entity.username}}<button v-if="role.entity.dnd == true" type="button" class="btn btn-danger" style="padding: 3px; font-size: 10px;margin: 0px; margin-left: 2px; cursor: auto;">DND</button></td>
                <td v-if="role.type == 'tigertext:entity:account'"><button type="button" class="btn btn-success" @click="selectUser(role.entity.token, role.entity.first_name+' '+role.entity.last_name)">Select</button></td>
              </tr>
              <tr v-if="continuation_user != null && continuation_user < total_user && continuation_user != 0" class="py-2 bg-white hover:bg-bggray border-b">
                <td colspan="3"><button id="fetch_btn_users" type="button" class="btn btn-info" @click="fetchMoreUsers(continuation_user)">Fetch More Results...</button><label id="fetch_text_users" class="d-none">Fetching...</label></td>
              </tr>
            </table>
          </div>

        </div>
      </template>

        <template v-slot:footer>
          <div class="border-t d-flex align-items-center justify-content-between">
            <button type="button" class="btn btn-danger" @click="closeCombinedPopup()">Cancel</button>
          </div>
        </template>
      </modal>



      <modal ref="modalName2" style="margin: 0px auto; max-width: 1200px;">
        <template v-slot:header>
          <h1 class="font-bold">Search for an UMMS Tiger Role</h1>
          <h2 @click="closeProviderModal2()" class="font-bond" style="float: right; cursor: pointer;">x</h2>
        </template>

        <template v-slot:body>
          <div style="min-height:400px; text-align: left;" class="border-r border-l">
            <input placeholder="Search for a role" class="form-input bg-gray-400 rounded" type="text" @input="checkRole($event.target.value)" />
            <br/><input type="checkbox" v-bind:name="onlyOnDuty" v-bind:value="onlyOnDuty" v-model="onlyOnDuty" class="mr-3 mt-3 mb-3"/><label>Only show results with someone on-duty?</label>
            <table class="table min-w-full">
              <tr>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Role Name</td>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Person on Duty</td>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Action</td>
              </tr>
              <tr v-if="!onlyOnDuty || ((role.type == 'tigertext:entity:account' && role.entity.metadata.owners.length > 0 && checkIfValidUser(role.entity.metadata.owners[0].username)) || (role.type == 'tigertext:entity:team' && role.entity.members.length > 0))" class="py-2 bg-white hover:bg-bggray border-b" v-for="role in roleResults">
                <td v-if="role.type == 'tigertext:entity:account'" class="py-2">{{role.entity.display_name}}</td>
                <td v-if="role.type == 'tigertext:entity:team'" class="py-2">{{role.entity.name}}</td>

                <td class="py-2" v-if="role.type == 'tigertext:entity:account' && role.entity.metadata.owners.length > 0 && checkIfValidUser(role.entity.metadata.owners[0].username)">{{role.entity.metadata.owners[0].username}}</td> <td class="text-red-700" v-if="role.type == 'tigertext:entity:account' && (role.entity.metadata.owners.length == 0 || checkIfValidUser(role.entity.metadata.owners[0].username) == false)">No one on duty</td>
                <td class="py-2" v-if="role.type == 'tigertext:entity:team' && role.entity.members.length > 0">Team Account (1+ member(s))</td> <td class="text-red-700" v-if="role.type == 'tigertext:entity:team' && (role.entity.members.length == 0)">No one on duty</td>

                <td v-if="role.type == 'tigertext:entity:account' && role.entity.metadata.owners.length > 0"><button type="button" class="btn btn-success" @click="selectRole(role.entity.token, role.entity.display_name, role)">Select</button></td> <td class="text-red-700" v-if="role.type == 'tigertext:entity:account' && role.entity.metadata.owners.length == 0"></td>
                <td v-if="role.type == 'tigertext:entity:team' && role.entity.members.length > 0"><button type="button" class="btn btn-success" @click="selectTeam(role.entity.token, role.entity.name)">Select</button></td> <td class="text-red-700" v-if="role.type == 'tigertext:entity:team' && role.entity.members.length == 0"></td>
              </tr>
              <tr v-if="continuation != null && continuation < total" class="py-2 bg-white hover:bg-bggray border-b">
                <td colspan="3"><button id="fetch_btn" type="button" class="btn btn-info" @click="fetchMoreRoles(continuation)">Fetch More Results...</button><label id="fetch_text" class="d-none">Fetching...</label></td>
              </tr>
            </table>
          </div>
        </template>

        <template v-slot:footer>
          <div class="border-t d-flex align-items-center justify-content-between">
            <button type="button" class="btn btn-danger" @click="closeProviderModal2()">Cancel</button>
          </div>
        </template>
      </modal>

      <modal ref="supportModal" style="margin: 0px auto; max-width: 1200px;">
        <template v-slot:header>
          <h3 class="font-bold">Contact Support/Give Feedback</h3>
          <h2 @click="closeSupportModal()" class="font-bond" style="float: right; cursor: pointer;">x</h2>
        </template>

        <template v-slot:body>
          <div style="text-align: left;" class="border-r border-l">
            <p>Please type your message below. You can use this form for support or to give feedback about the usability of the application.</p>
            <p style="font-weight:900;">*NOTE: This message is sent to the developers of the messaging application, NOT to the providers.</p>
            <textarea-input v-model="feedback_data" data-background-color="blue" style="margin-top: 10px; border: 1px solid lightgray; border-radius: 5px;" rows="10" aria-placeholder="Type message here...">
            </textarea-input>
          </div>
        </template>

        <template v-slot:footer>
          <div class="border-t d-flex align-items-center justify-content-between">
            <button type="button" style="float:left;" class="btn btn-danger" @click="closeSupportModal()">Cancel</button>
            <button type="button" style="float:right;" class="btn btn-success" @click="sendFeedback()">Send</button>
          </div>
        </template>
      </modal>


      <modal ref="newAffiliateAddModal" style="margin: 0px auto; max-width: 1200px;">
        <template v-slot:header>
          <h1 class="font-bold">Search for an UMMS Tiger User</h1>
          <h2 @click="closePopup()" class="font-bond" style="float: right; cursor:pointer;">x</h2>
        </template>

        <template v-slot:body>
          <div style="min-height:400px; text-align: left;" class="border-r border-l">
            <input placeholder="Search for a user" class="form-input bg-gray-400 rounded" type="text" @input="checkUser($event.target.value)" />
            <br/><br/>
            <table class="table min-w-full">
              <tr>
                <td class="border-b-2 pb-2 pt-2 border-t-2">User Name</td>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Tiger Account</td>
                <td class="border-b-2 pb-2 pt-2 border-t-2">Action</td>
              </tr>
              <tr v-if="((role.type == 'tigertext:entity:account' && checkIfValidUser(role.entity.username)))" class="py-2 bg-white hover:bg-bggray border-b" v-for="role in userResults">
                <td v-if="role.type == 'tigertext:entity:account'" class="py-2">{{role.entity.first_name}} {{role.entity.last_name}}</td>

                <td class="py-2" v-if="role.type == 'tigertext:entity:account'">{{role.entity.username}}</td>

                <td v-if="role.type == 'tigertext:entity:account'"><button type="button" class="btn btn-success" @click="selectUser(role.entity.token, role.entity.first_name+' '+role.entity.last_name)">Select</button></td>
              </tr>
              <tr v-if="continuation_user != null && continuation_user < total_user && continuation_user != 0" class="py-2 bg-white hover:bg-bggray border-b">
                <td colspan="3"><button id="fetch_btn_user" type="button" class="btn btn-info" @click="fetchMoreUsers(continuation_user)">Fetch More Results...</button><label id="fetch_text_user" class="d-none">Fetching...</label></td>
              </tr>
            </table>
          </div>
        </template>

        <template v-slot:footer>
          <div class="border-t d-flex align-items-center justify-content-between">
            <button type="button" class="btn btn-danger" @click="closePopup()">Cancel</button>
          </div>
        </template>
      </modal>

    </div>
    <div v-if="epic.csn == '0'" id="top_panel2" class="container m-auto" style="width: 100%; margin-left: 0px !important; margin-right: 0px !important; max-width: 100%;">
        <div id="no_csn" style="background-color: #7f231c !important; padding: 20px; border-radius:10px; margin-top: 15px;" class="danger alert-danger" role="alert">
          You must launch the Envoy Messaging App from within an encounter.
        </div>
    </div>
    </div>






</template>
<style scoped>


.vs__dropdown-menu {
  border: 1pt solid gray;
  z-index: 5000;
}

.vs__dropdown-toggle {
  border: 1pt solid gray;
}

.vs__dropdown-option--highlight {
  color: white;
  background-color: #0897a9;
}


.btn.btn-info {
  color: #fff;
  background-color: #0897a9;
  border-color: #0897a9;
}
.btn.btn-outline-info {
  color: #0897a9;
  background-color: transparent;
  border-color: #0897a9;
}

.vs__dropdown-option {
  background-color: white;
}
.card-body {
  padding-top: 10px;
  padding-bottom: 10px;
}
.my-title-bubble {
  background-color: red !important;
}
</style>
<script>
import vSelect from 'vue-select'
import Modal from './Modal'
import TextareaInput from './TextareaInput'
import Icon from './Icon'
import axios from 'axios'
import vTitle from 'vuejs-title'
import { bus } from '../app'

export default {
  name: 'vuefrontend',
  components: {
    vSelect,
    Modal,
    TextareaInput,
    axios,
    vTitle,
    Icon,
  },

  data() {
    return {
      name: '',
      message: 'Hello World, ',
      tiger_message: '',
      patient_string: 'John Doe, 42yo male, CSN: 500800000000',
      role: '',
      roleResults: [],
      total: 0,
      continuation: 0,
      user: '',
      userResults: [],
      sender: '',
      total_user: 0,
      continuation_user: 0,
      onlyOnDuty: false,
      isResizing: false,
      epic: {},
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      recipients: [],
      sending_in_progress: false,
      smartphrase_choice: '',
      users_tab: true,
      roles_tab: false,
      current_roles: [],
      current_teams: [],
      looper: 0,
      signature: '',
      show_signature: false,
      from_text: '',
      smartphrases_clicked: [],
      feedback_data: '',
      tags: [],
      current_tags: [],
      priority: "0",
      read_receipts: false,
      readReceiptPeople: [],
    }
  },
  created() {
    this.name = this.$parent.params.name;
    this.epic = this.$parent.params.epic;
    this.signature = this.epic.signature.text;
    if(this.signature != "" && this.epic.signature_checked == true) {
      this.show_signature = true;
    }
    if(this.epic.tiger_active) {
      this.sender = this.epic.current_user.tigerID;
    }
    else {
      this.sender = "";
    }
    this.getCurrentRoles();
    this.sendDefaultedSBs();
    //send requests for defaulted speed buttons
    this.getTags();
    //get Tags lookup list from Tiger API
    this.checkDnds();
    //check if anyone on the treatment team is a DND currently via the Tiger API, also grab current role owner from First Call Role

    for(var i = 0; i < this.epic.default_recipient_list.length; i++) {
      this.selectUser(this.epic.default_recipient_list[i].token, this.epic.default_recipient_list[i].name);
    }
    if(this.epic.current_roles.length > 0) {
      //default sender to first role
      this.selectSender(this.epic.current_roles[0].entity.token, this.epic.current_roles[0].entity.display_name);
      this.from_text = 'FROM: '+this.epic.current_roles[0].entity.display_name+' ['+this.epic.current_user.name+']\n' +
          '-------------------------\n';
    }
    else {
      this.from_text = 'FROM: '+this.epic.current_user.name+'\n' +
          '-------------------------\n';
    }

    bus.$on('modal-opened', (data) => {
      //check for modal open select
      if(data.$vnode.data.ref == 'modalName2') {
        setTimeout((function () {
          this.$refs.modalName2.$el.children[1].children[1].children[0].children[0].focus();
//          this.searchFiltered('');
        }).bind(this), 500);
      }
      else if(data.$vnode.data.ref == 'combinedModal') {
        setTimeout((function () {
//          this.$refs.newAffiliateAddModal.$el.children[1].children[1].children[0].children[0].focus();
          document.getElementById('search_terms_combined').focus();
 //         this.searchFiltered('');
        }).bind(this), 500);
      }
    })

//    this.name = this.$el.attributes['data-params'].value;
  },
  methods: {
    getTigerName(owner) {

      if(owner.username != '') {
        return owner.username
      }
      else {
        return owner.display_name;
      }
    },
    searchAll() {
      this.current_tags = [];
      this.checkBoth(document.getElementById('search_terms_combined').value);
    },
triggerEvent(el, type){
  if ('createEvent' in document) {
    // modern browsers, IE9+
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  } else {
    // IE 8
    var e = document.createEventObject();
    e.eventType = type;
    el.fireEvent('on'+e.eventType, e);
  }
},
    toggleReadReceipts() {
      if(this.read_receipts) {
        this.read_receipts = false;
      }
      else {
        this.read_receipts = true;
        //toggle all on
        this.readReceiptPeople = [];
        for (var i = 0; i < this.recipients.length; i++) {
          var recipient = this.recipients[i];
          if(recipient.type != "tigertext:entity:team") {
            this.readReceiptPeople.push(recipient.token);
          }
        }
      }
    },
    toggleSignature() {
      if(this.show_signature) {
        this.show_signature = false;
      }
      else {
        this.show_signature = true;
      }
    },
    togglePriority() {
      if(this.priority == "1") {
        this.priority = "0";
      }
      else {
        this.priority = "1";
      }
    },
    getTags() {
      axios.put('/tags', {}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
          this.tags = res.data['tags'];
          this.epic['provider_lookup'] = res.data['provider_lookup'];
      })
    },
    checkDnds() {
      axios.put('/check_dnds', {treatment_team: this.epic.treatment_team}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        this.epic.treatment_team = res.data;
      })
    },
    getCurrentRoles() {
      axios.put('/get_current_roles', {current_user: this.epic.current_user}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        this.epic['current_roles'] = res.data;
      })
    },
    sendDefaultedSBs(){
      var that = this;
      for (var i = 0; i < this.epic.defaulted_smartphrases.length; i++){
        (function(i, that) {
          setTimeout(function () {
            if(that.epic.defaulted_smartphrases[i].defaulted) {
              console.log(that.epic.defaulted_smartphrases[i].mnemonic);
//              that.doGetCaretPosition();
              if(that.epic.defaulted_smartphrases[i].sb) {
                that.speedButton('SB'+that.epic.defaulted_smartphrases[i].mnemonic, that.epic.defaulted_smartphrases[i].id);
              }
              else {
                that.speedButton(that.epic.defaulted_smartphrases[i].mnemonic, that.epic.defaulted_smartphrases[i].id);
              }
//              that.smartphrases_clicked.push('SECUREMESSAGESB'+that.epic.sb_smart_phrases[i].mnemonic);
            }
          }, i*1500)
        })(i, that);
      }


    },
    checkBoth(terms) {
      if(this.users_tab) {
        this.checkUser(terms);
      }
      else {
        this.checkRole(terms);
      }
    },
    tagsValue() {
      this.checkBoth(document.getElementById('search_terms_combined').value);
    },
    toggleTabs(tab_name) {
      if(tab_name == 'users') {
        if(!this.users_tab) {
          this.users_tab = true;
          this.roles_tab = false;
          this.checkBoth(document.getElementById('search_terms_combined').value);
          //Call check user with the right thing?
        }
      }
      else {
        if(!this.roles_tab) {
          this.roles_tab = true;
          this.users_tab = false;
          //Call check roles with the right thing?
          this.checkBoth(document.getElementById('search_terms_combined').value);
        }
      }
    },
    checkValue() {
      if(this.smartphrase_choice.mnemonic !== undefined) {
        this.speedButton(this.smartphrase_choice.mnemonic, this.smartphrase_choice.id);
        this.smartphrase_choice = '';
      }
    },
    toggleSmartPhraseContainer() {
      if(document.getElementById('smartphrases_container').classList.contains("d-none")) {
        document.getElementById('smartphrases_container').classList.remove("d-none");
      }
      else {
        document.getElementById('smartphrases_container').classList.add("d-none");
      }
    },
    speedButton(key, hh1ID) {
//      console.log("ID is "+key);
      this.smartphrases_clicked.push('SECUREMESSAGE'+key);
      axios.put('/smartphrase_query', {csn: this.epic.csn, userID: this.epic.current_user.userID, mnemonic: 'SECUREMESSAGE'+key, hh1ID: hh1ID}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        this.tiger_message = this.tiger_message + ""+res.data.data.ret;

/*        var myField = document.getElementById('tiger_textarea');
        console.log(myField);
        var myValue = res.data.data.ret;

        if (document.selection) {
          myField.focus();
          var sel;
          sel = document.selection.createRange();
          sel.text = myValue;
        }
        // Microsoft Edge
        else if(window.navigator.userAgent.indexOf("Edge") > -1) {
          var startPos = myField.selectionStart;
          var endPos = myField.selectionEnd;

          myField.value = myField.value.substring(0, startPos)+ myValue
              + myField.value.substring(endPos, myField.value.length);

          var pos = startPos + myValue.length;
          myField.focus();
          myField.setSelectionRange(pos, pos);
        }
        //MOZILLA and others
        else if (myField.selectionStart || myField.selectionStart == '0') {
          var startPos = myField.selectionStart;
          var endPos = myField.selectionEnd;
          myField.value = myField.value.substring(0, startPos)
              + myValue
              + myField.value.substring(endPos, myField.value.length);
        } else {
          myField.value += myValue;
        }
        this.triggerEvent(myField,'input'); */


      })
    },
    openProviderSearch2() {
      this.$refs.modalName2.openModal();
    },
    closeProviderModal2() {
      this.$refs.modalName2.closeModal();
    },
    removeRecipient(token) {
      var filtered_array = this.recipients.filter(function( obj ) {
        return obj.token !== token;
      });
      this.recipients = filtered_array;

      var filtered_current_roles = this.current_roles.filter(function(obj) {
        return obj.entity.token !== token;
      });
      this.current_roles = filtered_current_roles;

      var filtered_current_teams = this.current_teams.filter(function(obj) {
        return obj.entity.token_from_team !== token;
      });
      this.current_teams = filtered_current_teams;
    },
    fetchMoreRoles(continuation) {
      document.getElementById('fetch_btn_roles').classList.add("d-none");
      document.getElementById('fetch_text_roles').classList.remove("d-none");
      axios.put('/search_roles_continuation', {query: this.role, tags: this.current_tags, continuation: continuation}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        this.roleResults = this.roleResults.concat(res.data.roles);
        this.total = res.data.total;
        this.continuation = res.data.continuation;
      })

      setTimeout(function () {
        document.getElementById('fetch_btn_roles').classList.remove("d-none");
        document.getElementById('fetch_text_roles').classList.add("d-none");
      }, 3000);
    },
    fetchMoreUsers(continuation_user) {
      document.getElementById('fetch_btn_users').classList.add("d-none");
      document.getElementById('fetch_text_users').classList.remove("d-none");
      axios.put('/search_users_continuation', {query: this.user, continuation: continuation_user}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        this.userResults = this.userResults.concat(res.data.users);
        this.total_user = res.data.total;
        this.continuation_user = res.data.continuation;
      })

      setTimeout(function () {
        document.getElementById('fetch_btn_users').classList.remove("d-none");
        document.getElementById('fetch_text_users').classList.add("d-none");
      }, 3000);
    },
    checkIfValidUser(tigerId) {
      return true;
    },
    selectTeam(token, name) {
      this.$refs.modalName2.closeModal();
      if(this.$refs.combinedModal !== undefined) {
        this.$refs.combinedModal.closeModal();
      }
      var exists = this.isInRecipients(token);

      if(!exists) {
        this.searchTeams(token);
        this.recipients.push({name: name, token: token, type: 'tigertext:entity:team'})
      }
      this.current_tages = [];
    },
    searchTeams(members) {
      var self = this;
      axios.put('/search_teams', {teams: members}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        res.data.members.forEach(function (element) {
          if(element.metadata.owners && element.metadata.owners.length > 0) {
//            console.log("Checking for "+element.metadata.owners[0].username);
            element['token_from_team'] = members;
            //self.current_teams.push({entity: element});
            self.addToCurrentTeams(element);

          }
          else {
            if(element.username.includes("@")) {
              //self.selectRole(element.username, element.first_name+' '+element.last_name);
//              console.log("Checking for "+element.first_name+" "+element.last_name);
              element['token_from_team'] = members;
              self.addToCurrentTeams(element);
            }
          }

        })

        self.selectRole('token', 'display_name', {entity: 'entity'});
      })
    },
    addToCurrentTeams(element) {
       this.current_teams.push({entity: element});
    },
    selectRole(token, display_name, entity) {

      if(token != "token") {
        this.role = '';
        this.$refs.modalName2.closeModal();

        if(this.$refs.combinedModal !== undefined) {
          this.$refs.combinedModal.closeModal();
        }
        var exists = this.isInRecipients(token);
        var type = entity.type;
        if(!exists) {
          this.recipients.push({name: display_name, token: token, type: type})
        }
        this.roleResults = [];
        this.userResults = [];

        this.continuation = 0;
        this.total = 0;

        this.current_roles.push({entity: entity.entity});
      }
      else {
      }
      this.current_tages = [];
    },
    selectSender(token, display_name) {
      this.sender = token;
      if(display_name == this.epic.current_user.name) {
        this.from_text = 'FROM: '+display_name+'\n' +
            '-------------------------\n';
      }
      else {
        this.from_text = 'FROM: '+display_name+' ['+this.epic.current_user.name+']\n' +
          '-------------------------\n';
      }
    },
    selectUser(token, display_name, suggested=false) {
      this.role = '';
//      console.log("Selecting user "+display_name);
      if(this.$refs.newAffiliateAddModal !== undefined) {
        this.$refs.newAffiliateAddModal.closeModal();
      }
      if(this.$refs.combinedModal !== undefined) {
        this.$refs.combinedModal.closeModal();
      }
      var exists = this.isInRecipients(token);

      if(!exists) {
        this.recipients.push({name: display_name, token: token, type: 'user'})
      }
      else {
        if(suggested) {
          this.removeRecipient(token);
        }
        //toggle them off
      }
      this.userResults = [];
      this.roleResults = [];
      this.continuation_user = 0;
      this.total_user = 0;
    },
    isInRecipients(token) {

      var response = this.recipients.filter(function (x) {
        if(x.token == token) {
          return true
        }
      });
      if(response.length > 0) {
        return true;
      }
      return false;
    },
    cancelSearch () {
      if (this.cancelSource) {
        this.cancelSource.cancel('Start new search, stop active search');
//        console.log('cancel request done');
      }
    },
    checkRole(terms) {
      this.role = terms;
      this.cancelSearch(); //cancel any previous search pending
      this.cancelSource = axios.CancelToken.source();

      axios.put('/search_roles', {query: terms, tags: this.current_tags}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
        cancelToken: this.cancelSource.token,
      }) .then (res => {
        this.roleResults = res.data.roles;
        this.total = res.data.total;
        this.continuation = res.data.continuation;
      })
    },

    checkUser(terms) {
      this.user = terms;
      this.cancelSearch(); //cancel any previous search pending
      this.cancelSource = axios.CancelToken.source();

      axios.put('/search_users', {query: terms}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
        cancelToken: this.cancelSource.token,
      }) .then (res => {

        this.userResults = res.data.users;
        this.total_user = res.data.total;
        this.continuation_user = res.data.continuation;
      })
    },

    openPopup() {
      this.$refs.newAffiliateAddModal.openModal();
    },
    closePopup() {
      this.$refs.newAffiliateAddModal.closeModal();
    },
    openCombinedPopup() {
      this.$refs.combinedModal.openModal();
    },
    closeSupportModal() {
      this.$refs.supportModal.closeModal();
    },
    openSupportModal() {
      this.$refs.supportModal.openModal();
    },
    closeCombinedPopup() {
      this.current_tags = [];
      this.$refs.combinedModal.closeModal();
    },
    sendMessage() {

      var that = this;
      var signature_text = "";
      this.sending_in_progress = true;
      if(this.signature!="" && this.show_signature) {

        signature_text = "\n-------------------------\n"+this.signature;
      }
      var non_tiger_disclaimer = '';
      if(!this.epic.tiger_active) {
        non_tiger_disclaimer = '\n-------------------------\nPlease note: The sender of this message does not have an active Tiger account. If you attempt to reply to this message, the sender will not see it.';
      }
      axios.put('/send_message', {message: this.from_text+this.tiger_message+signature_text+non_tiger_disclaimer, recipients: this.recipients, sender: this.sender, csn: this.epic.csn, initial_payload: this.epic, team_members: this.current_teams, role_members: this.current_roles, signature: this.signature, signature_id: null, priority: this.priority, show_signature: this.show_signature, read_receipts: this.read_receipts, read_receipts_people: this.readReceiptPeople}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        this.sending_in_progress = false;
        document.getElementById('message_sent').innerText = res.data['status'];
        document.getElementById('send_btn').classList.add("d-none");
        document.getElementById('message_sent').classList.remove("d-none");
        this.epic.signature.hh1ID = res.data['hh1ID'];
        setTimeout(function () {
          document.getElementById('message_sent').classList.add("d-none");
          document.getElementById('send_btn').classList.remove("d-none");
          that.recipients = [];
          that.current_roles = [];
          that.current_teams = [];
          that.tiger_message = '';
          that.sendDefaultedSBs();
          for(var i = 0; i < that.epic.default_recipient_list.length; i++) {
//            console.log("should be adding defaulted "+that.epic.default_recipient_list[i].token);
            that.selectUser(that.epic.default_recipient_list[i].token, that.epic.default_recipient_list[i].name);
          }
        }, 3000);
      })
    },
    sendFeedback() {

      var that = this;
      axios.put('/send_feedback', {message: this.epic.current_user.name+': '+this.epic.current_user.tigerID+' - '+this.feedback_data, csn: this.epic.csn, initial_payload: this.epic}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        document.getElementById('feedback_message_sent').innerText = 'Feedback Sent!';
        document.getElementById('feedback_message_sent').classList.remove("d-none");
        this.feedback_data = '';
        this.closeSupportModal();
        setTimeout(function () {
          document.getElementById('feedback_message_sent').classList.add("d-none");
        }, 3000);
      })
    }
  },
}
</script>