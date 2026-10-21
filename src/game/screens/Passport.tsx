import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../state";
import { Bar, Btn, Panel, Stars, Txt } from "../ui";
import { C } from "../theme";
import {
  CHAPTERS,
  CHAPTER_IDS,
  STATIONS,
  chapterStars,
  chapterMaxStars,
  starNeed,
  totalStars,
} from "../../data/chapters";
import { EGG_IDS, EGG_INFO, eggFlag } from "../../data/eggs";
import { levelOf, levelProgress } from "../types";
import { BatikCloth } from "../minigames/batikLib";
import { L, tr } from "../../lib/i18n";

export default function Passport({ onBack }: { onBack: () => void }) {
  const { profile, progress: p } = useGame();
  const ins = useSafeAreaInsets();
  const j = profile?.jenjang || "smp";
  const st = p.stats;
  const acc =
    st.correct + st.wrong
      ? Math.round((st.correct / (st.correct + st.wrong)) * 100)
      : 0;
  const eggsFound = EGG_IDS.filter((e) => p.flags[eggFlag(e)]).length;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: ins.top + 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingBottom: 8,
        }}
      >
        <Btn
          small
          kind="dark"
          label={L("← Kembali", "← Back")}
          onPress={onBack}
          testID="passport-back"
        />
        <Txt size={20} bold color={C.gold} center style={{ flex: 1 }}>
          {L("Paspor Budaya", "Culture Passport")}
        </Txt>
        <View style={{ width: 90 }} />
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: 14,
          gap: 12,
          paddingBottom: ins.bottom + 30,
          maxWidth: 560,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <Panel>
          <Txt size={18} bold color={C.gold}>
            {profile?.name} · {profile?.jenjang.toUpperCase()}
          </Txt>
          <Txt
            color={C.muted}
          >{`Level ${levelOf(p.xp)} · ${p.xp} XP · ${totalStars(p)} ${L("bintang", "stars")}`}</Txt>
          <Bar value={levelProgress(p.xp)} style={{ marginTop: 8 }} />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 10,
            }}
          >
            <Txt size={13}>{`🎯 ${L("Akurasi", "Accuracy")} ${acc}%`}</Txt>
            <Txt
              size={13}
            >{`👾 ${L("Bayangan", "Shadows")} ${st.defeated}`}</Txt>
            <Txt
              size={13}
            >{`🌼 ${L("Sekar Emas", "Golden Flowers")} ${p.collected.length}`}</Txt>
            <Txt size={13}>{`🎮 ${L("Main", "Played")} ${st.played}x`}</Txt>
          </View>
        </Panel>
        {CHAPTER_IDS.map((c) => {
          const ch = CHAPTERS[c];
          const has = p.badges.includes(c);
          const have = chapterStars(p, c),
            need = starNeed(j, c);
          return (
            <Panel key={c} style={{ borderColor: has ? C.gold : C.line }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Txt size={26}>{has ? "🏅" : "🔒"}</Txt>
                <View style={{ flex: 1 }}>
                  <Txt bold size={16} color={has ? C.gold : C.text}>
                    {ch.badge}
                  </Txt>
                  <Txt
                    size={12}
                    color={C.muted}
                  >{`${tr(ch.place)} · ★ ${have}/${need} ${L("untuk ujian", "for the exam")} (${L("maks", "max")} ${chapterMaxStars(c)})`}</Txt>
                </View>
              </View>
              <View style={{ gap: 4, marginTop: 8 }}>
                {ch.stations.map((s) => (
                  <View
                    key={s}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Txt size={13}>{STATIONS[s].title}</Txt>
                    <Stars n={p.stages[`${c}:${s}`]?.stars || 0} size={14} />
                  </View>
                ))}
              </View>
            </Panel>
          );
        })}
        <Panel>
          <Txt
            bold
            size={16}
            color={C.gold}
          >{`${L("Tamu Misterius", "Mystery Guests")} ${eggsFound}/${EGG_IDS.length}`}</Txt>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 8,
            }}
          >
            {EGG_IDS.map((e) => {
              const found = !!p.flags[eggFlag(e)];
              return (
                <View
                  key={e}
                  style={{
                    alignItems: "center",
                    width: 92,
                    opacity: found ? 1 : 0.55,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: C.panel2,
                      borderWidth: 2,
                      borderColor: found ? C.gold : C.line,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Txt size={28}>{found ? EGG_INFO[e].emoji : "❓"}</Txt>
                  </View>
                  <Txt size={12} bold center>
                    {found ? EGG_INFO[e].name : "???"}
                  </Txt>
                  <Txt size={10} center color={C.muted}>
                    {found
                      ? EGG_INFO[e].place()
                      : L("Belum ditemukan", "Not found yet")}
                  </Txt>
                </View>
              );
            })}
          </View>
        </Panel>
        <Panel>
          <Txt bold size={16} color={C.gold}>
            {L("Galeri Batikku", "My Batik Gallery")}
          </Txt>
          {p.gallery.length === 0 ? (
            <Txt color={C.muted} size={13}>
              {L(
                "Belum ada karya. Gambar dan celup kainmu di Rumah Batik!",
                "No works yet. Draw and dye your cloth at the Batik House!",
              )}
            </Txt>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 8,
              }}
            >
              {p.gallery.map((w) => (
                <View key={w.id} style={{ alignItems: "center" }}>
                  <View
                    style={{
                      borderWidth: 3,
                      borderColor: "#6a4529",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <BatikCloth
                      size={120}
                      strokes={w.strokes}
                      dye={w.dye}
                      done={!!w.dye}
                    />
                  </View>
                  <Txt size={11} color={C.muted}>
                    {w.dyeName || w.motif}
                  </Txt>
                </View>
              ))}
            </View>
          )}
        </Panel>
        {p.bossDone ? (
          <Panel
            tone="light"
            style={{ alignItems: "center", borderColor: C.gold }}
          >
            <Txt size={30}>📜</Txt>
            <Txt bold size={18} color={C.gold} center>
              {L(
                "Sertifikat Penjaga Budaya Solo",
                "Certificate of Solo Culture Guardian",
              )}
            </Txt>
            <Txt center>{L("Diberikan kepada", "Awarded to")}</Txt>
            <Txt bold size={22} center color={C.gold}>
              {profile?.name}
            </Txt>
            <Txt center size={13} color={C.muted}>
              {L(
                "karena telah menjaga batik, wayang, keris, dan basa Jawa dari Bayangan Lupa.",
                "for protecting batik, wayang, keris, and the Javanese language from the Shadows of Forgetting.",
              )}
            </Txt>
          </Panel>
        ) : null}
      </ScrollView>
    </View>
  );
}
