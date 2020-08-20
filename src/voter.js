import { Fragment, h } from "preact";
import Helmet from "preact-helmet";
import { useVoter } from "./data";

export const Voter = ({ voterName }) => {
  const { Voter, Nickname, Affiliation, Organisation, ...votes } = useVoter(
    voterName
  );
  const names = Voter.split(" ");
  const firstName = names.filter((_, i) => i !== names.length - 1).join(" ");
  const lastName = names[names.length - 1];
  return (
    <Fragment>
      <Helmet title={`LEC Allstar - ${Voter}`} />
      <section class="hero is-dark is-bold">
        <div class="hero-body">
          <div class="columns is-centered">
            <div class="column is-three-quarters has-text-centered">
              <p class="subtitle is-3">
                {firstName}
                <span class="title is-1"> {Nickname} </span>
                {lastName}
              </p>
              <p>
                {Affiliation} {Organisation}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="columns">
            {[1, 2, 3].map((p) => (
              <div class="column has-text-centered">
                <h3 class="subtitle">#{p}</h3>
                <div class="table-container">
                  <table class="table is-bordered is-fullwidth">
                    <tbody>
                      {["Top", "Jungle", "Mid", "ADC", "Support"].map((pos) => (
                        <tr>
                          <td>
                            <a href={`/player/${votes[`#${p} ${pos}`]}`}>
                              {votes[`#${p} ${pos}`]}
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
    </Fragment>
  );
};
