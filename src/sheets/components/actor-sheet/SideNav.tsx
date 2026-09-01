import React from "react";
import styles from "./SideNav.module.scss";

export const SideNav = ({ activeTab, setActiveTab }: any) => (
  <aside className={styles.sideNav}>
    <button 
      className={`${styles.navBtn} ${activeTab === "principal" ? styles.active : ""}`} 
      onClick={() => setActiveTab("principal")} 
      title="Principal"
    >
      <i className="fas fa-id-card"></i>
    </button>
    <button 
      className={`${styles.navBtn} ${activeTab === "habilidades" ? styles.active : ""}`} 
      onClick={() => setActiveTab("habilidades")} 
      title="Habilidades e Itens"
    >
      <i className="fas fa-briefcase"></i>
    </button>
    <button 
      className={`${styles.navBtn} ${activeTab === "historico" ? styles.active : ""}`} 
      onClick={() => setActiveTab("historico")} 
      title="Histórico"
    >
      <i className="fas fa-scroll"></i>
    </button>
  </aside>
);