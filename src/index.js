import "preact/debug";
import "bulma/bulma.sass";
import Router from "preact-router";
import { h, render } from "preact";
import { DataProvider } from "./data";
import { Player } from "./player";
import { Position } from "./position";
import { Team } from "./team";
import { Voter } from "./voter";
import { Affiliation } from "./affiliation";
import { Home, Navbar, Players, Voters } from "./overview";

const Main = () => {
  return (
    <DataProvider name="summer2020">
      <Navbar />
      <Router>
        <Players path="/player" />
        <Player path="/player/:playerName" />
        <Position path="/position/:pos" />
        <Team path="/team/:teamName" />
        <Voters path="/voter" />
        <Voter path="/voter/:voterName" />
        <Affiliation path="/affiliation/:affiliationName" />
        <Home default />
      </Router>
    </DataProvider>
  );
};
render(<Main />, document.body);
