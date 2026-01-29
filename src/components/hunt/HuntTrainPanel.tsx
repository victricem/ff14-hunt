import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd'; // ⚠️ 加上 type
import { Share2, Trash2, X } from 'lucide-react';
import clsx from 'clsx';

interface TrainItem {
  id: string; 
  mobName: string;
  zone: string;
  server: string;
}

interface HuntTrainPanelProps {
  list: TrainItem[]; 
  setList: (list: TrainItem[]) => void;
  isMidnight: boolean;
}

export const HuntTrainPanel: React.FC<HuntTrainPanelProps> = ({ list, setList, isMidnight }) => {
  // 修正：如果沒有名單，完全不顯示
  if (!list || list.length === 0) return null;

  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const copyMacro = () => {
    const txt = `[巡迴名單]\n` + list.map((m, i) => `${i + 1}. [${m.server}] ${m.zone} | ${m.mobName}`).join('\n');
    navigator.clipboard.writeText(txt).then(() => {
        setCopyStatus("已複製！");
        setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={clsx("fixed bottom-4 left-2 right-2 md:left-8 md:right-8 z-50 rounded-3xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-10 font-black",
          isMidnight ? "bg-[#12141e]/95 border-white/10" : "bg-white/95 border-slate-200"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-white/5">
           <div className="flex items-center gap-3">
              <div className={clsx("p-2 rounded-xl", isMidnight ? "bg-blue-600/20 text-blue-400" : "bg-blue-100 text-blue-600")}>
                  <Share2 className="w-5 h-5"/>
              </div>
              <div>
                  <div className="text-xs opacity-50 uppercase font-bold">Hunt Train</div>
                  <div className={clsx("font-black", isMidnight ? "text-white" : "text-slate-900")}>跨服名單 ({list.length})</div>
              </div>
           </div>
           <div className="flex gap-2">
               <button onClick={() => setList([])} className="p-2.5 hover:bg-red-500/20 rounded-xl text-red-500 transition-colors"><Trash2 className="w-5 h-5"/></button>
               <button onClick={copyMacro} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/30 active:scale-95 transition-all">
                   {copyStatus || '複製指令宏'}
               </button>
           </div>
        </div>

        <Droppable droppableId="train-list" direction="horizontal">
           {(provided) => (
             <div ref={provided.innerRef} {...provided.droppableProps} className="flex overflow-x-auto gap-3 p-4 custom-scrollbar scroll-smooth">
                {list.map((item, i) => (
                    <Draggable key={item.id} draggableId={item.id} index={i}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style }}
                                className={clsx("shrink-0 p-3 pr-8 rounded-2xl border min-w-[160px] relative group select-none transition-colors",
                                    snapshot.isDragging 
                                        ? (isMidnight ? "bg-blue-900/40 border-blue-500 shadow-xl" : "bg-blue-50 border-blue-500 shadow-xl")
                                        : (isMidnight ? "bg-black/20 border-white/5 hover:border-white/20" : "bg-slate-50 border-slate-200 hover:border-blue-300")
                                )}
                            >
                                <div className="text-[9px] font-bold opacity-50 mb-1 flex items-center gap-1">
                                    <span className="bg-blue-600 text-white px-1.5 rounded-md">{i+1}</span>
                                    <span>[{item.server}] {item.zone}</span>
                                </div>
                                <div className={clsx("font-black text-sm truncate", isMidnight ? "text-slate-200" : "text-slate-800")}>{item.mobName}</div>
                                <button 
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={() => setList(list.filter(x => x.id !== item.id))}
                                    className={clsx("absolute top-2 right-2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all",
                                        isMidnight ? "bg-red-900 text-red-200" : "bg-red-100 text-red-600"
                                    )}
                                >
                                    <X className="w-3 h-3"/>
                                </button>
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
                <div className="w-2 shrink-0"></div>
             </div>
           )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};