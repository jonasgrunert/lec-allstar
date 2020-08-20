import { h } from "preact";
import { useState } from "preact/hooks";
import {
  useTeams,
  useAffiliations,
  usePlayers,
  useVoters,
  usePure,
} from "./data";

export const Navbar = () => {
  const [isActive, setActive] = useState(false);
  const teams = useTeams();
  const affilliations = useAffiliations();
  return (
    <nav class="navbar is-transparent">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          LEC Allstars
        </a>

        <a
          role="button"
          class={`navbar-burger burger ${isActive ? "is-active" : ""}`}
          onClick={() => setActive(!isActive)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        id="navbarBasicExample"
        class={`navbar-menu ${isActive ? "is-active" : ""}`}
      >
        <div class="navbar-start">
          <a class="navbar-item" href="/player">
            Players
          </a>
          <a class="navbar-item" href="/voter">
            Voters
          </a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Positions</a>

            <div class="navbar-dropdown">
              <a class="navbar-item" href="/position/top">
                Top
              </a>
              <a class="navbar-item" href="/position/jungle">
                Jungle
              </a>
              <a class="navbar-item" href="/position/mid">
                Mid
              </a>
              <a class="navbar-item" href="/position/adc">
                ADC
              </a>
              <a class="navbar-item" href="/position/support">
                Support
              </a>
            </div>
          </div>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Teams</a>

            <div class="navbar-dropdown">
              {teams.map((t) => (
                <a class="navbar-item" href={`/team/${t}`}>
                  {t}
                </a>
              ))}
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">Affiliations</a>

            <div class="navbar-dropdown">
              {affilliations.map((t) => (
                <a class="navbar-item" href={`/affiliation/${t}`}>
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <a
              class="button is-dark"
              href="https://github.com/jonasgrunert/lec-allstar"
            >
              Source
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Home = () => {
  const votes = usePure();
  return (
    <section class="hero is-dark is-fullheight-with-navbar">
      <div
        class="hero-body"
        style="justify-content: center; flex-direction: column;"
      >
        <div class="columns">
          <div class="column">
            <p>
              <h2 class="title is-1">LEC Allstars Summer 2020</h2>
            </p>
          </div>
        </div>
        <div class="columns" style="width: 100%">
          {[1, 2, 3].map((p) => (
            <div class="column has-text-centered">
              <h3 class="subtitle">#{p}</h3>
              <div class="table-container">
                <table class="table is-fullwidth has-text-white has-background-dark">
                  <tbody>
                    {[0, 1, 2, 3, 4].map((pos) => (
                      <tr>
                        <td>
                          <a
                            href={`/player/${votes[pos][p - 1].id}`}
                            class="has-text-white"
                          >
                            {votes[pos][p].id}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Players = () => {
  const teams = usePlayers();
  return (
    <div class="container">
      <div class="columns is-multiline">
        {teams.map((team) => (
          <div class="column is-one-fifth">
            <h3 class="subtitle">
              <a href={`/team/${team.team}`}>{team.team}</a>
            </h3>
            <table class="table is-bordered is-fullwidth">
              <tbody>
                {team.players.map((player) => (
                  <tr>
                    <td>
                      <a href={`/player/${player}`}>{player}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Voters = () => {
  const affilliations = useVoters();
  return (
    <div class="container">
      <div class="columns is-multiline">
        {affilliations.map((affiliation) => (
          <div class="column is-one-fifth">
            <h3 class="subtitle">
              <a href={`/affiliation/${affiliation.affiliation}`}>
                {affiliation.affiliation}
              </a>
            </h3>
            <table class="table is-bordered is-fullwidth">
              <tbody>
                {affiliation.voters.map((voter) => (
                  <tr>
                    <td>
                      <a href={`/voter/${voter}`}>{voter}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
