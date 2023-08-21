<template>
  <div @click="printStuff">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <div class="bg-gray-200 max-h-80 flex flex-row p-3 px-4 border-b border-gray-300 shadow w-full inline-flex">
      <h5 class="my-0 w-full font-medium inline-flex flex"><img class="h-10 inline-flex flex" src="/build/images/logoumms.95173268.svg" alt="University of Maryland Medical System logo"></h5>
      <button class="max-w-xs inline-flex flex float-right bg-gray-500 text-white px-4 py-2 rounded mr-1" @click="openPreferencesModal()" type="button"><svg @click="openOptions()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mt-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>Preferences</button>
    </div>
    <div v-if="epic.csn != '0'" class="bg-white shadow-lg rounded p-8 w-full mx-auto">
      <!-- Send As -->
      <div class="mb-4 flex items-center">
        <h2 class="text-lg font-semibold">Send As:</h2>
        <div class="ml-4">
          <button v-if="epic.tiger_active == false" class="text-sm mr-1 hover:bg-blue-200 hover:text-blue-800 py-1 px-4 hover:border-transparent rounded btn-sm btn-danger">{{ epic.current_user.name }}</button>
          <button v-if="epic.tiger_active == true" class="text-sm mt-1 mr-1 hover:bg-blue-200 hover:text-blue-800 py-1 px-4 hover:border-transparent rounded btn-sm" :class="{ 'text-blue-800 bg-blue-200': sender == epic.current_user.tigerID, 'bg-white border border-blue-200 text-blue-800': sender != epic.current_user.tigerID }" @click="selectSender(epic.current_user.tigerID, epic.current_user.name)">{{ epic.current_user.name }}</button>
          <button v-if="epic.tiger_active == true" v-for="(role_obj,key) in epic.current_roles" class="text-sm mt-1 mr-1 hover:bg-blue-200 hover:text-blue-800 py-1 px-4 hover:border-transparent rounded btn-sm" :class="{ 'text-blue-800 bg-blue-200': sender == role_obj.entity.token, 'bg-white border border-blue-200 text-blue-800': sender != role_obj.entity.token }" @click="selectSender(role_obj.entity.token, role_obj.entity.display_name)">{{role_obj.entity.display_name}}</button>
        </div>
      </div>
      <p v-if="epic.tiger_active == false" class="text-red-500 leading-normal ml-4 italic">You do not have a Tiger Account.<br>Call helpdesk to activate your account to allow 2-way communication.<br>Responses to your message can only be sent to the Tiger App.</p>
      <!-- Send To -->
      <div class="mb-4">
        <h2 class="text-lg font-semibold mb-1 inline-flex">Send To:</h2>
        <div class="border border-gray-500 rounded p-2 w-auto mb-2 inline-flex flex-wrap max-w-screen-md">
          <div class="border-b pb-1">
          <button v-for="recipient in recipients" @click="removeRecipient(recipient.token)" class="max-h-9 mt-1 mr-1 bg-blue-200 text-blue-800 text-xs py-2 px-4 border border-blue-200 rounded btn-sm inline-flex">
            {{ recipient.name }} <span class=" ml-1 rounded bg-gray-400 text-white p-1">
              <svg class="h-2 w-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg></span>
          </button>
          </div>
          <input id="terms" @input="checkBothNew($event.target.value)" @focusin="setFocusTrue()" class="ml-2 w-auto inline-flex good-stuff" style="min-width: 400px; outline: none;" type="text" placeholder="Type recipient's name...">
        </div>
<!--
        <div class="rounded p-2 w-auto mb-2 inline-flex flex-wrap">
          <button class="rounded border border-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>

          </button>
        </div>
-->


        <div id="resultsContainer" style="min-width:300px;" class="z-10 absolute mt-0 overflow-y-auto h-96 max-w-md w-md bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl divide-y"
             v-infinite-scroll="loadMore"
             infinite-scroll-disabled="sending"
             infinite-scroll-distance="50"
             v-show="isFocused()"
        >
          <div class="divide-y good-stuff" v-if="epic.treatment_team['Favorites'].length > 0">
            <div data-v-bb75941e="" class="good-stuff flex items-center p-1 px-2 bg-gray-100">
              <div data-v-bb75941e="" class="good-stuff flex flex-col">
                <strong data-v-bb75941e="" class="good-stuff text-gray-900 text-sm font-bold">FAVORITES </strong>
              </div>
            </div>
            <div v-if="epic.treatment_team['Favorites'].length > 0" id="favorites_results">
            <div v-for="(team_obj,key) in epic.treatment_team['Favorites']" data-v-bb75941e="" class="good-stuff flex items-center gap-4 p-2 hover:bg-blue-600 group cursor-pointer" @click="selectUserNew({entity: {token: team_obj.token, name: team_obj.name}}, {entity_type: 'team'});">
              <svg v-if="isInFavorites(team_obj.token)" @click="removeFavorite(team_obj.token)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg v-if="!isInFavorites(team_obj.token)" @click="selectUserNewPref(actual_entity, entity)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <div data-v-bb75941e="" class="flex flex-col group-hover:text-white" style="max-width: 375px;">
                <strong data-v-bb75941e="" class="text-gray-900 text-sm font-medium group-hover:text-white">{{ team_obj.name }} <button v-if="team_obj.dnd == true" type="button" class="text-xs bg-red-500 white font-semibold text-white py-1 px-1 ml-1 border border-red-500 rounded py-0 text-xs cursor-auto">DND</button></strong>
                <span v-if="team_obj.role_user != undefined" data-v-bb75941e="" class="text-gray-500 text-sm font-medium group-hover:text-white">On Duty: {{ team_obj.role_user }}</span>
              </div>
            </div>
            </div>
          </div>
          <div class="divide-y good-stuff" v-for="entity in new_results">
            <div v-if="entity != undefined && entity.entity_type.toUpperCase() != 'GROUP'" data-v-bb75941e="" class="good-stuff flex items-center p-1 px-2 bg-gray-100">
              <div data-v-bb75941e="" class="good-stuff flex flex-col inline-flex">
                <strong data-v-bb75941e="" class="good-stuff text-gray-900 text-sm font-bold inline-flex">{{ entity.entity_type.toUpperCase() }}S
                  <svg v-if="checkVisible(entity.entity_type) == false" @click="collapseFavorites(entity.entity_type)"  xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <svg v-if="checkVisible(entity.entity_type) == true" @click="collapseFavorites(entity.entity_type)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                  </svg>
                </strong>
              </div>
            </div>
            <div v-bind:id="entity.entity_type">
              <div v-for="actual_entity in entity.values" data-v-bb75941e="" class="good-stuff flex items-center gap-4 p-2 hover:bg-blue-600 group cursor-pointer" @click="selectUserNew(actual_entity, entity);">
                <svg v-if="isInFavorites(actual_entity.entity.token)" @click="removeFavorite(actual_entity.entity.token)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg v-if="!isInFavorites(actual_entity.entity.token)" @click="selectUserNewPref(actual_entity, entity)" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                  <div data-v-bb75941e="" class="flex flex-col group-hover:text-white" style="max-width: 375px;">
                    <strong v-if="entity.entity_type == 'team'" data-v-bb75941e="" class="text-gray-900 text-sm font-medium group-hover:text-white">{{ actual_entity.entity.name }}</strong>
                    <strong v-if="entity.entity_type == 'role'" data-v-bb75941e="" class="text-gray-900 text-sm font-medium group-hover:text-white">{{ actual_entity.entity.display_name }}</strong>
                    <strong v-if="entity.entity_type == 'individual'" data-v-bb75941e="" class="text-gray-900 text-sm font-medium group-hover:text-white">{{ actual_entity.entity.display_name }} <button v-if="actual_entity.entity.dnd == true" type="button" class="text-xs bg-red-500 white font-semibold text-white py-1 px-1 ml-1 border border-red-500 rounded py-0 text-xs cursor-auto">DND</button></strong>
                    <span v-if="entity.entity_type == 'team'" data-v-bb75941e="" class="text-gray-500 text-sm font-medium group-hover:text-white">{{ actual_entity.entity.description }}</span>
                    <span v-if="entity.entity_type == 'role' && ((actual_entity.entity.metadata.owners.length > 0 && checkIfValidUser(actual_entity.entity.metadata.owners[0].username)) && actual_entity.entity.metadata.owners[0].username != '')" data-v-bb75941e="" class="text-gray-500 text-sm font-medium group-hover:text-white">On Duty: {{ actual_entity.entity.metadata.owners[0].username }}</span>
                    <span v-if="entity.entity_type == 'role' && ((actual_entity.entity.metadata.owners.length == 0))" data-v-bb75941e="" class="text-red-500 text-sm font-medium group-hover:text-red-500">No One On Duty!</span>
                    <span v-if="entity.entity_type == 'individual'" data-v-bb75941e="" class="text-gray-500 text-sm font-medium group-hover:text-white">{{ [actual_entity.entity.title.trim(), actual_entity.entity.department.trim()].filter(Boolean).join(", ") }}</span>
                  </div>
              </div>
            </div>
          </div>
          <div v-show="loading" class="good-stuff text-center py-4">
            <button v-show="loading_text" type="button" class="good-stuff inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow transition ease-in-out duration-150 cursor-not-allowed" disabled="">               <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>               </svg>               Loading...             </button>
          </div>
        </div>
        <div>
          <div v-if="team != 'Favorites'" v-bind:class="{ 'flex-wrap flex ml-0': team=='Favorites', 'ml-0': team != 'Favorites' }" class="inline-flex flex flex-wrap " v-for="(obj, team) in epic.treatment_team" v-bind:id="team">
            <button v-for="(team_obj,key) in epic.treatment_team[team]" type="button" class="ml-1 mt-1 text-xs py-2 px-2 border border-blue-200 rounded btn-sm" :class="{ 'bg-blue-200 text-blue-800': isInRecipients(team_obj.token), 'bg-white hover:bg-blue-200 text-blue-800': !isInRecipients(team_obj.token)}" @click="selectUser(team_obj.token, team_obj.name, true)">
              <b>{{team}}<span v-if="team_obj.role_user != undefined"> ({{team_obj.role_user}})</span><button v-if="team_obj.dnd == true" type="button" class="text-xs bg-red-500 white font-semibold text-white py-1 px-1 ml-1 border border-red-500 rounded py-0 text-xs cursor-auto">DND</button></b>
              <br/>{{team_obj.name}}
            </button>
          </div>
        </div>
      </div>

      <!-- Message Body -->
      <div class="mb-4">
        <div class="inline-flex">
          <h2 class="text-lg font-semibold mb-1">Message Body:</h2>
          <v-select class="ml-2 py-0 my-0 w-72" placeholder="Search for a Smartphrase..." :change="checkValue()" v-model="smartphrase_choice" value="mnemonic" label="mnemonic" :options="epic.smart_phrases">
            <template v-slot:option="option">
              {{ option.description }}
            </template>
          </v-select>
        </div>
        <div class="mt-2 mb-2">
          <button v-for="sb in epic.sb_smart_phrases" class="text-sm py-1 ml-1 mt-1 px-4 hover:border-transparent rounded btn-sm" :class="{ 'text-blue-800 bg-blue-200': smartphrases_clicked.includes('SECUREMESSAGESB'+sb.mnemonic), 'bg-white border border-blue-200 text-blue-800': !smartphrases_clicked.includes('SECUREMESSAGESB'+sb.mnemonic) }" @click="speedButton('SB'+sb.mnemonic, sb.id)">{{sb.description}}</button>
        </div>
        <textarea-input :class="{ 'urgent-picked pt-1 pl-1 pr-1 rounded': priority==1, '': priority!=1 }" id="tiger_textarea" class="" v-model="tiger_message" rows="10" aria-placeholder="Type message here..."></textarea-input>
      </div>

      <div>
        <h5 class="w-20 pt-3 mr-3 mb-0 inline-flex"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pt-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg> Priority:</h5>
        <input @change="togglePriority()" v-bind:checked="priority=='1'" name="priority" id="priority" type="checkbox"/> <label for="priority" class="mb-0 text-gray-600 text-sm">Send as Urgent Message?</label>
      </div>
      <div>
        <h5 class="pt-3 mr-3 mb-0 inline-flex"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pt-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg> Signature:</h5>
        <input @change="toggleSignature()" v-bind:checked="show_signature" name="show_signature" id="show_signature" type="checkbox"/> <label for="show_signature" class="mb-0 text-gray-600 text-sm">Add my signature</label><p v-if="epic.tiger_active==false" class="text-red-600 mt-0 mb-0 ml-2">*If you don't have Tiger, please add a callback number to your signature line</p>
      </div>
    <div>
      <input v-if="show_signature==true" class="mt-2 border border-gray-300 rounded p-1 w-full" type="text" v-model="signature"/>
    </div>

      <!-- Send Button -->
      <div>
        <button v-if="recipients.length > 0 && !sending_in_progress" id="send_btn" @click="sendMessage()" type="button" class="inline-flex py-1 mt-1 px-4 hover:border-transparent rounded btn-sm text-white bg-blue-500 hover:bg-blue-400"><icon name="send" class="mt-1"/> Send</button>
        <button v-if="recipients.length == 0 || sending_in_progress" id="send_btn" class="inline-flex py-1 mt-1 px-4 hover:border-transparent rounded btn-sm text-white bg-gray-700 hover:bg-gray-700"><icon name="send" class="mt-1"/> Send</button>
        <a class="text-white" href="https://toc-envoytst01.umms.umm.edu/training"><button class="inline-flex py-1 mt-1 px-4 float-right bg-yellow-600 text-white rounded mr-1" type="button">Tipsheets</button></a>
        <button class="inline-flex py-1 mt-1 px-4 float-right bg-yellow-600 text-white rounded mr-1" @click="openSupportModal()" type="button"><icon name="support" class=""/>Feedback Form</button>
      </div>
      <div v-if="recipients.length == 0" class="mt-4 text-red-600">
        *At least one recipient is required to send!
      </div>

      <div class="mt-4">
        NOTE: If you are expecting a response to the message but don't receive one, use an alternative mode of communication as a back-up.
      </div>
      <div id="message_sent" class="hidden mt-4 bg-green-200 text-green-700 px-4 py-2 rounded" role="alert">
        Message sent!
      </div>
      <div id="feedback_message_sent" class="hidden mt-4 bg-green-200 text-green-700 px-4 py-2 rounded" role="alert">
        Feedback Message sent!
      </div>
      <modal ref="supportModal" style="margin: 0px auto; max-width: 1200px;">
        <template v-slot:header class="border-b">
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
            <button type="button" style="float:left;" class="bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded btn-danger" @click="closeSupportModal()">Cancel</button>
            <button type="button" style="float:right;" class="bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded btn-success" @click="sendFeedback()">Send</button>
          </div>
        </template>
      </modal>

      <modal ref="preferencesModal" style="margin: 0px auto; max-width: 1600px;">
        <template v-slot:header class="border-b">
          <h3 class="font-bold">Preferences for {{ epic.current_user.name }}</h3>
          <h2 @click="closePreferencesModal()" class="font-bond" style="float: right; cursor: pointer;">x</h2>
        </template>

        <template v-slot:body>
          <div style="text-align: left;" class="">
            <h4 class="inline-flex text-lg font-semibold"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pt-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>Favorite Recipients:</h4>
            <p>The recipients below will automatically appear as "Suggested Recipients" each time you launch the messaging application. You can manage your current Favorites below.</p>
            <h4 v-if="pref_favs.length > 0" class="text-md font-semibold pt-2">Current Favorites:</h4>
            <div class="" v-for="fav in pref_favs">
              <div class="inline-flex flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pt-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
              </div>
              <div class="ml-2 inline-flex flex">{{fav.name}}</div>
              <div class="ml-2 inline-flex flex">
                  <svg @click="removeFavorite(fav.token)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pt-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
              </div>
            </div>
            <p v-if="pref_favs.length == 0">*You have no favorites currently. Search for users/roles/teams and click the star icon to add them to your favorites*</p>
            <p class="pb-2"></p>
            <hr/>

            <h4 class="inline-flex text-lg font-semibold pt-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pt-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg> Signature Settings:</h4>
            <p>Your signature is only included if you check the box to include it. However, you can set your preference below on whether you want to automatically default it to being included.</p>
            <p><input v-model="default_show_signature" type="checkbox"/> <label for="" class="mb-0 text-gray-600 text-sm">Append my signature by default</label></p>
            <p><input class="mt-2 border border-gray-300 rounded p-1 w-full" type="text" v-model="signature"/></p>
            <p v-if="epic.tiger_active==false" class="text-red-600 mt-0 mb-0 ml-2">*If you don't have Tiger, please add a callback number to your signature line</p>

          </div>
        </template>

        <template v-slot:footer>
          <div class="border-t d-flex align-items-center justify-content-between pt-2">
            <button type="button" style="float:left;" class="bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded btn-danger" @click="closePreferencesModal()">Cancel</button>
            <button type="button" style="float:right;" class="bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded btn-success" @click="savePreferences()">Save</button>
          </div>
          <div id="preferences_saved" class="hidden mt-12 bg-green-200 text-green-700 px-4 py-2 rounded" role="alert">
            Preferences Saved!
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
      loading: false,
      loading_pref: false,
      user: '',
      userResults: [],
      sender: '',
      total_user: 0,
      total_results: 0,
      total_results_pref: 0,
      new_results: [],
      new_results_pref: [],
      continuation_total: 0,
      continuation_total_pref: 0,
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
      smartphrase_choice2: '',
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
      loading_text: true,
      loading_text_pref: true,
      isFocus: false,
      isFocusPref: false,
      first_load: true,
      pref_signature: '',
      default_show_signature: false,
      pref_favs: [],
    }
  },
  created() {
    this.name = this.$parent.params.name;
    this.epic = this.$parent.params.epic;
    this.pref_favs = this.epic.prefs.pref_favs;
    this.default_show_signature = this.epic.prefs.auto_signature;
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
  mounted()
  {
    document.getElementById('terms').setAttribute('tabindex', '0');
    document.getElementById('terms').focus();
  },
  computed: {
  },
  methods: {
    checkVisible(entity_type) {
      if(document.getElementById(entity_type) == undefined) {
        return false;
      }

      if(document.getElementById(entity_type).style.display != 'none') {
        return true;
      }
      else {
        return false;
      }
    },
    collapseFavorites(category) {
      console.log("Need to figure out how..."+category);
      if(document.getElementById(category).style.display != 'none') {
        document.getElementById(category).style.display = 'none';
      }
      else {
        document.getElementById(category).style.display = 'block';
      }
      //trigger new search?
      this.continuation_total = 0;
      this.total_results = 0;
      this.loadMore();
      if (!e) var e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    },
    setFocusTrue() {
      this.isFocus = true;
      this.checkBothNew(document.getElementById('terms').value);
      document.querySelector("body").classList.add("overflow-hidden");
    },
    setFocusTruePref() {
      this.isFocusPref = true;
      document.querySelector("body").classList.add("overflow-hidden");
    },
    printStuff(event) {
      console.log("YO CLICKED SOMEWHERE");
      var activeElement = document.activeElement;
      console.log(event.target);
      if(event.target.classList.contains("good-stuff")) {
        console.log("a good spot");
      }
      else {
        console.log("a BAD spot");
        this.resetStuff();
        this.resetStuffPref();
      }
    },
    isFocused() {
      return this.isFocus;
    },
    isFocusedPref() {
      return this.isFocusPref;
    },
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
    resetStuff() {
      this.continuation_total = 0;
      this.total_results = 0;
      this.new_results = [];
      this.loading_text = true;
      this.isFocus = false;
      document.querySelector("body").classList.remove("overflow-hidden");

      this.userResults = [];
      this.roleResults = [];
      this.continuation_user = 0;
      this.total_user = 0;
      document.getElementById('terms').value = '';
    },
    resetStuffPref() {
      this.continuation_total_pref = 0;
      this.total_results_pref = 0;
      this.new_results_pref = [];
      this.loading_text_pref = true;
      this.isFocusPref = false;
      document.querySelector("body").classList.remove("overflow-hidden");

      this.userResults = [];
      this.roleResults = [];
      this.continuation_user = 0;
      this.total_user = 0;
//      document.getElementById('terms_pref').value = '';
    },
    checkBothNew(terms) {
      this.cancelSearch(); //cancel any previous search pending
      this.cancelSource = axios.CancelToken.source();

      var teams = document.getElementById('team');
      var roles = document.getElementById('role');
      var individuals = document.getElementById('individual');

      var include_teams = true;
      var include_roles = true;
      var include_individuals = true;

      if(teams != undefined && teams.style.display == 'none') {
        include_teams = false;
      }
      if(roles != undefined && roles.style.display == 'none') {
        include_roles = false;
      }
      if(individuals != undefined && individuals.style.display == 'none') {
        include_individuals = false;
      }

      axios.put('/search_everything', {query: terms, includes: [include_teams, include_roles, include_individuals]}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
        cancelToken: this.cancelSource.token,
      }) .then (res => {
        var myDiv = document.getElementById('resultsContainer');
        myDiv.scrollTop = 0;
        this.new_results = res.data.results
        this.total_results = res.data.total;
        this.continuation_total = res.data.continuation;
      })
    },
    checkBothNewPref(terms) {
      this.cancelSearch(); //cancel any previous search pending
      this.cancelSource = axios.CancelToken.source();

      axios.put('/search_everything', {query: terms}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
        cancelToken: this.cancelSource.token,
      }) .then (res => {
        this.new_results_pref = res.data.results
        this.total_results_pref = res.data.total;
        this.continuation_total_pref = res.data.continuation;
      })
    },
    loadMore() {
      this.loading = true;
      this.cancelSearch(); //cancel any previous search pending
      this.cancelSource = axios.CancelToken.source();
      console.log("Continuation_Total is "+this.continuation_total);

      var teams = document.getElementById('team');
      var roles = document.getElementById('role');
      var individuals = document.getElementById('individual');

      var include_teams = true;
      var include_roles = true;
      var include_individuals = true;

      if(teams != undefined && teams.style.display == 'none') {
        include_teams = false;
      }
      if(roles != undefined && roles.style.display == 'none') {
        include_roles = false;
      }
      if(individuals != undefined && individuals.style.display == 'none') {
        include_individuals = false;
      }


      if(this.continuation_total == 0 && this.total_results != 0) {
        this.loading_text = false;
        console.log("Just set loading text to false");
        return;
      }
      else {
        this.loading_text = true;
        this.first_load = false;
      }

      if(this.continuation_total == 0) {
        this.new_results = [{entity_type: 'team', values: []},{entity_type: 'role', values: []},{entity_type: 'individual', values: []},];
      }

      axios.put('/search_everything_continuation', {query: document.getElementById('terms').value, continuation: this.continuation_total, includes: [include_teams, include_roles, include_individuals]}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
        cancelToken: this.cancelSource.token,
      }) .then (res => {
        var response_lookup = [];
        var previous_response_lookup = [];

        console.log("Should be setting total_results to "+res.data.total);
        console.log("Should be setting continuation_total to "+res.data.continuation);
        this.total_results = res.data.total;
        this.continuation_total = res.data.continuation;
        this.loading = false;

        for (var key = 0; key <= 2; key++) {
          // Check if the data array has the current key and if it has an 'entity_type' property
          if (res.data.results.hasOwnProperty(key) && res.data.results[key].hasOwnProperty('entity_type')) {
            response_lookup[res.data.results[key].entity_type] = key;
          }
        }
        for (var key = 0; key <= 2; key++) {
          // Check if the data array has the current key and if it has an 'entity_type' property
          if (this.new_results.hasOwnProperty(key) && this.new_results[key].hasOwnProperty('entity_type')) {
            previous_response_lookup[this.new_results[key].entity_type] = key;
          }
        }

        if (Object.keys(previous_response_lookup).length == 0) {
          this.new_results = res.data.results;
        }

        else {
          for (var key = 0; key <= 2; key++) {
            // Check if the data array has the current key and if it has an 'entity_type' property
            if (res.data.results.hasOwnProperty(key) && res.data.results[key].hasOwnProperty('entity_type')) {
              if(previous_response_lookup[res.data.results[key].entity_type] == undefined) {
                this.new_results[previous_response_lookup[res.data.results[key].entity_type]] = {entity_type: key, values: []};
                this.new_results[previous_response_lookup[res.data.results[key].entity_type]].values = res.data.results[key].values;
              }
              else {
                this.new_results[previous_response_lookup[res.data.results[key].entity_type]].values = this.new_results[previous_response_lookup[res.data.results[key].entity_type]].values.concat(res.data.results[key].values);
              }
            }
          }
        }
      })
    },
    loadMorePref() {
      this.loading_pref = true;
      this.cancelSearch(); //cancel any previous search pending
      this.cancelSource = axios.CancelToken.source();
      console.log("Continuation_Total is "+this.continuation_total_pref);
      if(this.continuation_total_pref == 0 && this.total_results_pref != 0) {
        this.loading_text_pref = false;
        console.log("Just set loading text to false");
        return;
      }
      else {
        this.loading_text_pref = true;
      }
      axios.put('/search_everything_continuation', {query: document.getElementById('terms_pref').value, continuation: this.continuation_total}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
        cancelToken: this.cancelSource.token,
      }) .then (res => {
        var response_lookup = [];
        var previous_response_lookup = [];

        console.log("Should be setting total_results to "+res.data.total);
        console.log("Should be setting continuation_total to "+res.data.continuation);
        this.total_results_pref = res.data.total;
        this.continuation_total_pref = res.data.continuation;
        this.loading_pref = false;

        for (var key = 0; key <= 2; key++) {
          // Check if the data array has the current key and if it has an 'entity_type' property
          if (res.data.results.hasOwnProperty(key) && res.data.results[key].hasOwnProperty('entity_type')) {
            response_lookup[res.data.results[key].entity_type] = key;
          }
        }
        for (var key = 0; key <= 2; key++) {
          // Check if the data array has the current key and if it has an 'entity_type' property
          if (this.new_results_pref.hasOwnProperty(key) && this.new_results_pref[key].hasOwnProperty('entity_type')) {
            previous_response_lookup[this.new_results_pref[key].entity_type] = key;
          }
        }

        if (Object.keys(previous_response_lookup).length == 0) {
          this.new_results_pref = res.data.results;
        }

        else {
          for (var key = 0; key <= 2; key++) {
            // Check if the data array has the current key and if it has an 'entity_type' property
            if (res.data.results.hasOwnProperty(key) && res.data.results[key].hasOwnProperty('entity_type')) {
              this.new_results_pref[previous_response_lookup[res.data.results[key].entity_type]].values = this.new_results_pref[previous_response_lookup[res.data.results[key].entity_type]].values.concat(res.data.results[key].values);
            }
          }
        }
      })
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
      if(document.getElementById('smartphrases_container').classList.contains("hidden")) {
        document.getElementById('smartphrases_container').classList.remove("hidden");
      }
      else {
        document.getElementById('smartphrases_container').classList.add("hidden");
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
    removeFavorite(token) {
      if (!e) var e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
      var filtered_array = this.pref_favs.filter(function( obj ) {
        return obj.token !== token;
      });
      this.pref_favs = filtered_array;

      if(this.epic.treatment_team['Favorites'] != undefined) {
        var filtered_array2 = this.epic.treatment_team['Favorites'].filter(function( obj ) {
          return obj.token !== token;
        });
        this.epic.treatment_team['Favorites'] = filtered_array2;
      }

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
      document.getElementById('fetch_btn_roles').classList.add("hidden");
      document.getElementById('fetch_text_roles').classList.remove("hidden");
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
        document.getElementById('fetch_btn_roles').classList.remove("hidden");
        document.getElementById('fetch_text_roles').classList.add("hidden");
      }, 3000);
    },
    fetchMoreUsers(continuation_user) {
      document.getElementById('fetch_btn_users').classList.add("hidden");
      document.getElementById('fetch_text_users').classList.remove("hidden");
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
        document.getElementById('fetch_btn_users').classList.remove("hidden");
        document.getElementById('fetch_text_users').classList.add("hidden");
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
    selectUserNew(actual_entity, entity) {
      console.log(actual_entity);
      console.log(entity);
      if(entity.entity_type == 'team') {
        this.selectUser(actual_entity.entity.token, actual_entity.entity.name, false);
      }
      if(entity.entity_type == 'role') {
        this.selectUser(actual_entity.entity.token, actual_entity.entity.display_name, false);
      }
      if(entity.entity_type == 'individual') {
        this.selectUser(actual_entity.entity.token, actual_entity.entity.display_name, false);
      }
      this.resetStuff();
    },
    isInFavorites(token) {
      var response = this.pref_favs.filter(function (x) {
        if(x.token == token) {
          return true
        }
      });
      if(response.length > 0) {
        return true;
      }
      return false;
    },
    selectUserNewPref(actual_entity, entity) {
      console.log(actual_entity);
      console.log(entity);
      if (!e) var e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();

      if(entity.entity_type == 'team') {
        this.pref_favs.push({name: actual_entity.entity.name, token: actual_entity.entity.token});
        this.epic.treatment_team['Favorites'].push({name: actual_entity.entity.name, token: actual_entity.entity.token});
      }
      if(entity.entity_type == 'role') {
        this.pref_favs.push({name: actual_entity.entity.display_name, token: actual_entity.entity.token});
        this.epic.treatment_team['Favorites'].push({name: actual_entity.entity.display_name, token: actual_entity.entity.token});
      }
      if(entity.entity_type == 'individual') {
        this.pref_favs.push({name: actual_entity.entity.display_name, token: actual_entity.entity.token});
        this.epic.treatment_team['Favorites'].push({name: actual_entity.entity.display_name, token: actual_entity.entity.token});
      }
      this.resetStuffPref();
    },
    selectUser(token, display_name, suggested=false) {
      this.role = '';
      console.log("Selecting user "+display_name);
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
    closePreferencesModal() {
      this.$refs.preferencesModal.closeModal();
    },
    openPreferencesModal() {
      this.$refs.preferencesModal.openModal();
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
      axios.put('/send_message', {message: this.from_text+this.tiger_message+signature_text+non_tiger_disclaimer, recipients: this.recipients, sender: this.sender, csn: this.epic.csn, initial_payload: this.epic, team_members: this.current_teams, role_members: this.current_roles, signature: this.signature, signature_id: null, priority: this.priority, show_signature: this.show_signature, read_receipts: this.read_receipts, read_receipts_people: this.readReceiptPeople, auto_signature: this.default_show_signature, favorites: this.pref_favs}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        this.sending_in_progress = false;
        document.getElementById('message_sent').innerText = res.data['status'];
        document.getElementById('send_btn').classList.add("hidden");
        document.getElementById('message_sent').classList.remove("hidden");
//        this.epic.signature.hh1ID = res.data['hh1ID'];
        setTimeout(function () {
          document.getElementById('message_sent').classList.add("hidden");
          document.getElementById('send_btn').classList.remove("hidden");
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
    savePreferences() {
      var that = this;
      axios.put('/save_preferences', {user: this.epic.current_user.tigerID, signature: this.signature, auto_signature: this.default_show_signature, favorites: this.pref_favs}, {
        onStart: () => this.sending = true,
        onFinish: () => this.sending = false,
        preserveScroll: true,
      }) .then (res => {
        document.getElementById('preferences_saved').classList.remove("hidden");
        setTimeout(function () {
          document.getElementById('preferences_saved').classList.add("hidden");
        }, 4000);
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
        document.getElementById('feedback_message_sent').classList.remove("hidden");
        this.feedback_data = '';
        this.closeSupportModal();
        setTimeout(function () {
          document.getElementById('feedback_message_sent').classList.add("hidden");
        }, 3000);
      })
    }
  },
}
</script>