import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Choice, Script } from '../data/dialogs';
import { Btn, Panel, Portrait, Txt, Typewriter } from './ui';
import { C } from './theme';

export default function DialogBox({ script, onAction }: { script: Script; onAction: (action: string) => void }) {
  const ins = useSafeAreaInsets();
  const [id, setId] = useState(script.start);
  const [typed, setTyped] = useState(false);
  useEffect(() => { setId(script.start); }, [script]);
  useEffect(() => { setTyped(false); }, [id]);
  const node = script.nodes[id];
  if (!node) return null;
  const pick = (c: Choice) => { if (c.next) setId(c.next); if (c.action) onAction(c.action); };
  const advance = () => { if (node.next) setId(node.next); else if (node.action) onAction(node.action); else onAction('close'); };
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, zIndex: 60, justifyContent: 'flex-end', backgroundColor: 'rgba(10,6,3,0.35)', paddingBottom: ins.bottom + 12, paddingHorizontal: 10 }}>
      <View style={{ maxWidth: 560, width: '100%', alignSelf: 'center' }}>
        <Panel style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {node.portrait ? <Portrait name={node.portrait} size={72} /> : null}
            <View style={{ flex: 1 }}>
              <Txt bold color={C.gold} size={15}>{node.speaker}</Txt>
              <Typewriter key={id} text={node.text} onDone={() => setTyped(true)} size={15} />
            </View>
          </View>
          {typed ? (
            node.choices ? (
              <View style={{ gap: 8 }}>{node.choices.map((c, i) => <Btn key={i} label={c.label} kind={i === 0 ? 'gold' : 'dark'} small onPress={() => pick(c)} testID={`choice-${i}`} />)}</View>
            ) : <Btn label="Lanjut ▸" small onPress={advance} testID="dlg-next" style={{ alignSelf: 'flex-end' }} />
          ) : null}
        </Panel>
      </View>
    </View>
  );
}
