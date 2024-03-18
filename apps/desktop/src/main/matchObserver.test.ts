// import { ClientManager } from "../clientManager";
// import { GameEvent, MatchObserver } from "../matchObserver";
// import { MatchRecorderIPC } from "../matchRecorderIPC";

describe("Match Observer Tests", () => {

  it("placeholder", () => {})

  // let observer: MatchObserver;
  // let clientManagerMock: ClientManager;
  // let matchRecorderMock: MatchRecorderIPC;

  // beforeEach(async() => {
  //   clientManagerMock = new ClientManager();
  //   matchRecorderMock = new MatchRecorderIPC();
  //   observer = new MatchObserver(clientManagerMock, matchRecorderMock);
  // });

  // it("Should start recording when the game starts", async() => {

  //   jest.spyOn(clientManagerMock, 'getPlayer').mockReturnValue({
  //     username: 'username',
  //     tag: 'EUW',
  //     puuid: 'some-long-string',
  //     region: 'EUW1'
  //   });

  //   clientManagerMock.getPlayer();

  //   const wsMock = {
  //     subscribe: jest.fn()
  //   }

  //   jest.spyOn(wsMock, 'subscribe').mockImplementation((_, callback) => {
  //     // Simulate receiving GameEvent.START
  //     callback(GameEvent.START);
  //   });

  //   jest.spyOn(observer, "observe");
    

  //   await observer.observe();



  //   expect(matchRecorderMock.startRecording).toHaveBeenCalled();

  // })

})