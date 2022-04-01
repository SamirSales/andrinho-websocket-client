var stompClient = null;

function connect() {
  let host = $("#txthost").val();
  let channel = $("#txtChannel").val();

  var socket = null;

  try {
    socket = new WebSocket(host);
  } catch (ex) {
    console.log(ex);
  }

  stompClient = Stomp.over(socket);
  stompClient.debug = null;

  stompClient.connect({}, function (frame) {
    setConnected(true);
    stompClient.subscribe(channel, function (result) {
      showLog(result.body);
    });
  });
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  setConnected(false);
  console.log("Disconnected");
}

function setConnected(connected) {
  $("#btnConnect").prop("disabled", connected);
  $("#btnDisconnect").prop("disabled", !connected);
}

function showLog(message) {
  let log = JSON.parse(message);
  console.log(log);
}

function test(log) {
  let accordionTwo = $("#accordionTwo");

  let totalElements = $("#accordionExample > div.accordion-item").length;

  let clone = accordionTwo.clone();
  clone.attr("id", "accordion-" + totalElements);

  let cloneHeading = clone.find("#headingTwo");
  cloneHeading.attr("id", "heading-" + totalElements);

  let cloneAccordionButton = cloneHeading.find("button.accordion-button");
  cloneAccordionButton.html(
    "<strong>" +
      new Date(log.timeMillis).toLocaleString() +
      "&nbsp;-</strong> <strong>&nbsp;Level:&nbsp;</strong> " +
      log.level +
      " <strong>&nbsp;Logger name:&nbsp;</strong> " +
      log.loggerName
  );
  cloneAccordionButton.attr("data-bs-target", "#collapse-" + totalElements);
  cloneAccordionButton.attr("aria-controls", "collapse-" + totalElements);

  let cloneCollapseTwo = clone.find("#collapseTwo");
  cloneCollapseTwo.attr("id", "collapse-" + totalElements);
  cloneCollapseTwo.attr("aria-labelledby", "heading-" + totalElements);

  let cloneAccordionBody = cloneCollapseTwo.find("div.accordion-body");
  cloneAccordionBody.html(log.message);

  clone.insertAfter("#accordionTwo");
}

$(function () {
  $("form").on("submit", function (e) {
    e.preventDefault();
  });
  $("#connect").click(function () {
    connect();
  });
  $("#disconnect").click(function () {
    disconnect();
  });
});
