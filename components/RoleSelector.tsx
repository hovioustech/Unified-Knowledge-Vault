import React from 'react';
import { PartnerType } from '../types';
import { PARTNER_ROLES } from '../constants';
import { CheckCircle2 } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: PartnerType;
  onSelectRole: (role: PartnerType) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onSelectRole }) => {
  return (
    <div className="bg-white border-b border-vault-border shadow-sm pt-6 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-vault-text text-xl font-serif font-bold mb-2">
            Choose Your Market Perspective
          </h2>
          <p className="text-vault-muted text-sm">
            The Knowledge Vault adapts its curriculum delivery to match your organizational goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {PARTNER_ROLES.map((role) => {
            const isSelected = currentRole === role.type;
            return (
              <button
                key={role.type}
                onClick={() => onSelectRole(role.type)}
                className={`relative group p-4 rounded-xl border transition-all duration-300 text-left h-full flex flex-col
                  ${isSelected 
                    ? `border-vault-accent bg-vault-highlight shadow-md ring-1 ring-vault-accent/20` 
                    : `border-vault-border bg-white hover:border-vault-accent/50 hover:bg-slate-50`
                  }
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-white text-vault-accent' : `${role.bgColor} ${role.color}`}`}>
                    {role.icon}
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-vault-accent" />}
                </div>
                
                <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-vault-accent' : 'text-vault-text'}`}>
                  {role.label}
                </h3>
                
                <div className="mt-auto pt-2">
                  <p className="text-[11px] text-vault-muted leading-tight">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
